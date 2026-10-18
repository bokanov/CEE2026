"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import type { GuestPublic } from "@/lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [guests, setGuests] = useState<GuestPublic[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password");
      return;
    }
    setAuthed(true);
    loadGuests();
  }

  async function loadGuests() {
    const res = await fetch("/api/guests");
    if (res.ok) {
      const data = await res.json();
      setGuests(data.guests);
    }
  }

  useEffect(() => {
    if (authed) {
      const t = setInterval(loadGuests, 3000);
      return () => clearInterval(t);
    }
  }, [authed]);

  async function adjust(id: string, delta: number) {
    const reason = delta > 0 ? "Host bonus" : "Host adjustment";
    const res = await fetch("/api/admin/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guestId: id, delta, reason }),
    });
    if (res.ok) loadGuests();
  }

  if (!authed) {
    return (
      <main className="mx-auto max-w-md px-5 py-10">
        <SiteHeader title="Host admin" subtitle="Manual chip adjustments" />
        <form onSubmit={login} className="glass space-y-4 rounded-2xl p-6">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-pine-900/80 px-4 py-3"
          />
          {error ? <p className="text-sm text-cranberry-500">{error}</p> : null}
          <button type="submit" className="btn-gold w-full">Unlock</button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <SiteHeader title="Host admin" subtitle="Tap +/− for physical game payouts" />
      <ul className="space-y-3">
        {guests.map((g) => (
          <li
            key={g.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-pine-900/50 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              {g.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.photoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span className="text-xl">🎄</span>
              )}
              <span className="font-medium">{g.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="min-w-[4rem] text-right font-display text-gold-400">
                {g.balance}
              </span>
              <button
                type="button"
                onClick={() => adjust(g.id, -50)}
                className="rounded-lg bg-white/10 px-3 py-1 hover:bg-white/20"
              >
                −50
              </button>
              <button
                type="button"
                onClick={() => adjust(g.id, 50)}
                className="rounded-lg bg-gold-500/30 px-3 py-1 hover:bg-gold-500/50"
              >
                +50
              </button>
              <button
                type="button"
                onClick={() => adjust(g.id, 100)}
                className="rounded-lg bg-gold-500/30 px-3 py-1 hover:bg-gold-500/50"
              >
                +100
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
