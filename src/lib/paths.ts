import path from "path";

export function getDataDir(): string {
  return process.env.DATA_DIR ?? path.join(process.cwd(), "data");
}

export function getDbPath(): string {
  return path.join(getDataDir(), "party.db");
}

export function getUploadsDir(): string {
  return path.join(getDataDir(), "uploads");
}
