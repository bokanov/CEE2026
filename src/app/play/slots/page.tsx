"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
        ["🍒", "🍋", "⭐", "7️⃣", "🎁", "❄️"][Math.floor(Math.random() * 6)],
        ["🍒", "🍋", "⭐", "7️⃣", "🎁", "❄️"][Math.floor(Math.random() * 6)],
        ["🍒", "🍋", "⭐", "7️⃣", "🎁", "❄️"][Math.floor(Math.random() * 6)],
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
      <Link href="/play" className="text-sm text-gold-400">← Lobby</Link>
      <h1 className="mt-4 font-display text-3xl text-gold-400">Holiday Slots</h1>
      <p className="text-white/60">Balance: {balance.toLocaleString()} 🪙</p>
      <div className="mt-8 flex justify-center gap-3 rounded-2xl bg-pine-900/80 p-8 text-5xl">
        {reels.map((s, i) => (
          <span key={i} className="animate-slide-up">{s}</span>
        ))}
      </div>
      <p className="mt-4 min-h-[1.5rem] text-center text-gold-400">{message}</p>
      <label className="mt-6 block">
        <span className="text-sm text-white/70">Bet amount</span>
        <input
          type="number"
          min={1}
          max={balance}
          value={bet}
          onChange={(e) => setBet(parseInt(e.target.value, 10) || 1)}
          className="mt-2 w-full rounded-xl border border-white/15 bg-pine-900/80 px-4 py-3 text-lg"
        />
      </label>
      <button
        type="button"
        onClick={spin}
        disabled={spinning || balance < 1}
        className="btn-cranberry mt-4 w-full disabled:opacity-40"
      >
        {spinning ? "Spinning…" : "Spin"}
      </button>
    </main>
  );
}
