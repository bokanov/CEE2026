"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

type Me = { name: string; balance: number };

export default function PlayLobbyPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.guest) setMe({ name: data.guest.name, balance: data.guest.balance });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-snow-100/60">
        Loading… ❄️
      </main>
    );
  }

  if (!me) {
    return (
      <main className="mx-auto max-w-lg px-5 py-10 text-center">
        <SiteHeader title="Not registered" />
        <p className="mb-6 text-snow-100/80">Register first to get your chips.</p>
        <Link href="/register" className="btn-gold inline-block">
          Register now
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
      <SiteHeader title={`Hi, ${me.name}!`} subtitle="Pick a game — chips update live on the TV." />
      <div className="mb-6 rounded-2xl border-2 border-cranberry-500/40 bg-holly-900/75 p-5 text-center animate-pulse-glow">
        <p className="text-sm uppercase tracking-widest text-snow-100/60">Your balance</p>
        <p className="font-display text-4xl font-bold text-gold-300">
          {me.balance.toLocaleString()} <span className="text-2xl">🎁</span>
        </p>
      </div>
      <div className="grid gap-4">
        <Link
          href="/play/slots"
          className="glass flex items-center gap-4 rounded-2xl p-6 transition hover:border-gold-400/40 hover:bg-holly-800/50"
        >
          <Image
            src="/images/christmas-tree.jpg"
            alt=""
            width={64}
            height={80}
            className="h-16 w-12 shrink-0 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-gold-300">Holiday Slots</p>
            <p className="text-sm text-snow-100/60">Match trees, Santas &amp; snowflakes</p>
          </div>
        </Link>
        <Link
          href="/play/coin-flip"
          className="glass flex items-center gap-4 rounded-2xl p-6 transition hover:border-gold-400/40 hover:bg-holly-800/50"
        >
          <Image
            src="/images/santa.jpg"
            alt=""
            width={64}
            height={80}
            className="h-16 w-12 shrink-0 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-gold-300">Santa or Snow?</p>
            <p className="text-sm text-snow-100/60">50/50 — double or nothing</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
