"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { EVENT_NAME } from "@/lib/branding";
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
    <main className="relative min-h-screen px-6 py-8 md:px-12 md:py-10">
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/images/snow.jpg)" }}
        aria-hidden
      />
      <header className="relative mb-8 flex flex-wrap items-end justify-between gap-4 border-b-2 border-cranberry-500/40 pb-6">
        <div className="flex items-end gap-5">
          <Image
            src="/images/christmas-tree.jpg"
            alt=""
            width={120}
            height={160}
            className="hidden h-28 w-20 rounded-xl object-cover ring-2 ring-gold-400/50 md:block lg:h-36 lg:w-28"
          />
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-cranberry-400">
              Live leaderboard · ❄️
            </p>
            <h1 className="font-display text-4xl font-bold festive-title md:text-6xl">
              {EVENT_NAME}
            </h1>
          </div>
          <Image
            src="/images/santa.jpg"
            alt=""
            width={120}
            height={160}
            className="hidden h-28 w-20 rounded-xl object-cover ring-2 ring-cranberry-500/50 md:block lg:h-36 lg:w-28"
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-snow-100/60">
            {connected ? (
              <span className="text-green-400">●</span>
            ) : (
              <span>○</span>
            )}{" "}
            {connected ? "Live" : "Reconnecting…"}
          </p>
          {top ? (
            <p className="mt-1 text-lg text-snow-100/90">
              Leader: <span className="font-semibold text-gold-300">{top.name}</span> —{" "}
              {top.balance.toLocaleString()} 🎁
            </p>
          ) : null}
        </div>
      </header>

      {guests.length === 0 ? (
        <p className="relative text-center text-2xl text-snow-100/50">
          Waiting for guests to register… 🎅
        </p>
      ) : (
        <ul className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {guests.map((g) => (
            <li
              key={g.id}
              className={`animate-slide-up rounded-2xl border p-5 ${
                g.rank === 1
                  ? "border-gold-400/70 bg-gradient-to-br from-cranberry-600/25 via-gold-500/15 to-holly-900/80 shadow-[0_0_40px_rgba(250,204,21,0.25)]"
                  : "border-holly-600/40 bg-holly-900/70"
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold ${
                    g.rank <= 3
                      ? "bg-gradient-to-b from-gold-300 to-gold-500 text-holly-950"
                      : "bg-holly-800 text-snow-100/80"
                  }`}
                >
                  {g.rank}
                </span>
                {g.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.photoUrl}
                    alt=""
                    className="h-16 w-16 rounded-full border-2 border-cranberry-500/50 object-cover ring-2 ring-gold-400/30"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-holly-800 text-2xl ring-2 ring-gold-400/30">
                    🎅
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-semibold text-snow-50">{g.name}</p>
                  <p className="font-display text-3xl font-bold text-gold-300">
                    {g.balance.toLocaleString()}
                    <span className="ml-1 text-lg">🎁</span>
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
