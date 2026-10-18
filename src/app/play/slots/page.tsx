"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SLOT_SYMBOLS } from "@/lib/games";

export default function SlotsPage() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(["❄️", "❄️", "❄️"]);
  const [message, setMessage] = useState("");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.guest) {
          setBalance(d.guest.balance);
          setBet(Math.min(10, Math.max(1, d.guest.balance)));
        }
      });
  }, []);

  async function spin() {
    if (spinning) return;
    setSpinning(true);
    setMessage("");
    const interval = setInterval(() => {
      setReels([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);
    }, 80);
    try {
      const res = await fetch("/api/games/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet }),
      });
      const data = await res.json();
      clearInterval(interval);
      if (!res.ok) {
        setMessage(data.error ?? "Spin failed");
        setSpinning(false);
        return;
      }
      setReels(data.reels);
      setBalance(data.balance);
      setMessage(data.message);
    } catch {
      clearInterval(interval);
      setMessage("Network error");
    }
    setSpinning(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-8">
      <Link href="/play" className="text-sm text-gold-300 hover:text-gold-400">
        ← Lobby
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <Image
          src="/images/christmas-tree.jpg"
          alt=""
          width={56}
          height={72}
          className="h-14 w-11 rounded-lg object-cover ring-2 ring-gold-400/50"
        />
        <h1 className="font-display text-3xl festive-title">Holiday Slots</h1>
      </div>
      <p className="text-snow-100/70">Balance: {balance.toLocaleString()} 🎁</p>
      <div className="mt-8 flex justify-center gap-3 rounded-2xl border-2 border-cranberry-500/40 bg-holly-900/85 p-8 text-5xl shadow-[inset_0_0_40px_rgba(220,38,38,0.15)]">
        {reels.map((s, i) => (
          <span key={i} className="animate-slide-up">{s}</span>
        ))}
      </div>
      <p className="mt-4 min-h-[1.5rem] text-center text-gold-300">{message}</p>
      <label className="mt-6 block">
        <span className="text-sm text-snow-100/70">Bet amount</span>
        <input
          type="number"
          min={1}
          max={balance}
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value, 10) || 1)}
          className="mt-2 w-full rounded-xl border border-cranberry-500/30 bg-holly-900/80 px-4 py-3 text-lg outline-none ring-gold-400/40 focus:ring-2"
        />
      </label>
      <button
        type="button"
        onClick={spin}
        disabled={spinning || balance < 1}
        className="btn-cranberry mt-4 w-full disabled:opacity-40"
      >
        {spinning ? "Spinning…" : "🎄 Spin"}
      </button>
    </main>
  );
}
