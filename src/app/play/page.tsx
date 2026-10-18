"use client";

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
      <main className="flex min-h-screen items-center justify-center text-white/60">
        Loading…
      </main>
    );
  }

  if (!me) {
    return (
      <main className="mx-auto max-w-lg px-5 py-10 text-center">
        <SiteHeader title="Not registered" />
        <p className="mb-6 text-white/70">Register first to get your chips.</p>
        <Link href="/register" className="btn-gold inline-block">
          Register now
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
      <SiteHeader title={`Hi, ${me.name}!`} subtitle="Pick a game — chips update live on the TV." />
      <div className="mb-6 rounded-2xl border border-gold-500/30 bg-pine-900/70 p-5 text-center animate-pulse-glow">
        <p className="text-sm uppercase tracking-widest text-white/60">Your balance</p>
        <p className="font-display text-4xl font-bold text-gold-400">
          {me.balance.toLocaleString()} <span className="text-2xl">🪙</span>
        </p>
      </div>
      <div className="grid gap-4">
        <Link
          href="/play/slots"
          className="glass rounded-2xl p-6 transition hover:bg-white/10"
        >
          <p className="text-2xl">🎰</p>
          <p className="mt-2 font-semibold text-gold-400">Holiday Slots</p>
          <p className="text-sm text-white/60">Match symbols for multipliers</p>
        </Link>
        <Link
          href="/play/coin-flip"
          className="glass rounded-2xl p-6 transition hover:bg-white/10"
        >
          <p className="text-2xl">🪙</p>
          <p className="mt-2 font-semibold text-gold-400">Coin Flip</p>
          <p className="text-sm text-white/60">50/50 — double or nothing</p>
        </Link>
      </div>
    </main>
  );
}
