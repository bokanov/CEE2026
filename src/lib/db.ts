import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getDataDir, getDbPath, getUploadsDir } from "./paths";
import type { GuestPublic, GuestRow } from "./types";
import { notifyLeaderboard } from "./events";

let db: Database.Database | null = null;

function ensureDirs(): void {
  const dataDir = getDataDir();
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(getUploadsDir(), { recursive: true });
}

export function getDb(): Database.Database {
  if (!db) {
    ensureDirs();
    db = new Database(getDbPath());
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS guests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        photo_path TEXT,
        balance INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        guest_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        reason TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (guest_id) REFERENCES guests(id)
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_guest ON transactions(guest_id);
    `);
  }
  return db;
}

function startingBalance(): number {
  const raw = process.env.STARTING_BALANCE ?? "500";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 500;
}

export function rowToPublic(row: GuestRow, rank: number): GuestPublic {
  return {
    id: row.id,
    name: row.name,
    photoUrl: row.photo_path ? `/api/photos/${row.id}` : null,
    balance: row.balance,
    rank,
  };
}

export function listGuestsPublic(): GuestPublic[] {
  const rows = getDb()
    .prepare("SELECT * FROM guests ORDER BY balance DESC, name ASC")
    .all() as GuestRow[];
  return rows.map((row, i) => rowToPublic(row, i + 1));
}

export function getGuestById(id: string): GuestRow | undefined {
  return getDb().prepare("SELECT * FROM guests WHERE id = ?").get(id) as
    | GuestRow
    | undefined;
}

export function createGuest(name: string, photoFilename: string | null): GuestRow {
  const id = uuidv4();
  const balance = startingBalance();
  const createdAt = new Date().toISOString();
  getDb()
    .prepare(
      "INSERT INTO guests (id, name, photo_path, balance, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(id, name.trim(), photoFilename, balance, createdAt);
  recordTransaction(id, balance, "Starting chips");
  const guest = getGuestById(id)!;
  notifyLeaderboard(listGuestsPublic());
  return guest;
}

export function recordTransaction(
  guestId: string,
  amount: number,
  reason: string,
): void {
  getDb()
    .prepare(
      "INSERT INTO transactions (id, guest_id, amount, reason, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(uuidv4(), guestId, amount, reason, new Date().toISOString());
}

export function adjustBalance(
  guestId: string,
  delta: number,
  reason: string,
): GuestRow | null {
  const guest = getGuestById(guestId);
  if (!guest) return null;
  const next = Math.max(0, guest.balance + delta);
  getDb()
    .prepare("UPDATE guests SET balance = ? WHERE id = ?")
    .run(next, guestId);
  recordTransaction(guestId, delta, reason);
  notifyLeaderboard(listGuestsPublic());
  return getGuestById(guestId)!;
}

/** Deduct bet and apply net winnings (payout includes returned bet on wins). */
export function settleGame(
  guestId: string,
  bet: number,
  payout: number,
  reason: string,
): { ok: true; balance: number } | { ok: false; error: string } {
  const database = getDb();
  const settle = database.transaction(() => {
    const guest = getGuestById(guestId);
    if (!guest) return { ok: false as const, error: "Guest not found" };
    if (bet > guest.balance) return { ok: false as const, error: "Insufficient chips" };
    const net = payout - bet;
    const next = Math.max(0, guest.balance + net);
    database.prepare("UPDATE guests SET balance = ? WHERE id = ?").run(next, guestId);
    recordTransaction(guestId, net, reason);
    return { ok: true as const, balance: next };
  });
  const result = settle();
  if (result.ok) {
    notifyLeaderboard(listGuestsPublic());
  }
  return result;
}

export function saveGuestPhoto(guestId: string, ext: string, buffer: Buffer): string {
  const filename = `${guestId}${ext}`;
  const fullPath = path.join(getUploadsDir(), filename);
  fs.writeFileSync(fullPath, buffer);
  getDb()
    .prepare("UPDATE guests SET photo_path = ? WHERE id = ?")
    .run(filename, guestId);
  notifyLeaderboard(listGuestsPublic());
  return filename;
}

export function readGuestPhoto(filename: string): Buffer | null {
  const fullPath = path.join(getUploadsDir(), filename);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath);
}
