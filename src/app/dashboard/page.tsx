"use client";

import { useEffect, useState } from "react";
import type { GuestPublic } from "@/lib/types";

export default function DashboardPage() {
  const [guests, setGuests] = useState<GuestPublic[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const es = new EventSource("/api/leaderboard/stream");
    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);
    es.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as { guests: GuestPublic[] };
        setGuests(data.guests);
      } catch {
        /* ignore */
      }
    };
    return () => es.close();
  }, []);

  const top = guests[0];

  return (
    <main className="min-h-screen bg-pine-950 px-6 py-8 md:px-12 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gold-500/20 pb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-cranberry-500">Live leaderboard</p>
          <h1 className="font-display text-4xl font-bold text-gold-400 md:text-6xl">
            Christmas Casino Night
          </h1>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/50">
            {connected ? "● Live" : "○ Reconnecting…"}
          </p>
          {top ? (
            <p className="mt-1 text-lg text-white/80">
              Leader: <span className="font-semibold text-gold-400">{top.name}</span> —{" "}
              {top.balance.toLocaleString()} 🪙
            </p>
          ) : null}
        </div>
      </header>

      {guests.length === 0 ? (
        <p className="text-center text-2xl text-white/40">
          Waiting for guests to register…
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {guests.map((g) => (
            <li
              key={g.id}
              className={`animate-slide-up rounded-2xl border p-5 ${
                g.rank === 1
                  ? "border-gold-500/60 bg-gradient-to-br from-gold-500/15 to-pine-900/80 shadow-[0_0_40px_rgba(232,197,71,0.15)]"
                  : "border-white/10 bg-pine-900/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${
                    g.rank <= 3 ? "bg-gold-500 text-pine-950" : "bg-white/10 text-white/80"
                  }`}
                >
                  {g.rank}
                </span>
                {g.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.photoUrl}
                    alt=""
                    className="h-16 w-16 rounded-full border-2 border-gold-500/40 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pine-800 text-2xl">
                    🎅
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-semibold text-white">{g.name}</p>
                  <p className="font-display text-3xl font-bold text-gold-400">
                    {g.balance.toLocaleString()}
                    <span className="ml-1 text-lg">🪙</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
