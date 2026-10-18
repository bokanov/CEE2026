"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SIDES = [
  { id: "heads" as const, label: "Santa", emoji: "🎅" },
  { id: "tails" as const, label: "Snow", emoji: "❄️" },
];

export default function CoinFlipPage() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState<"heads" | "tails">("heads");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  async function flip() {
    if (loading) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/games/coin-flip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet, choice }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(data.error ?? "Flip failed");
        return;
      }
      setBalance(data.balance);
      const sideLabel = data.side === "heads" ? "Santa 🎅" : "Snow ❄️";
      setResult(
        data.won
          ? `🎉 ${sideLabel}! You won ${data.payout} chips!`
          : `It was ${sideLabel}. You lost ${bet} chips.`,
      );
    } catch {
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-8">
      <Link href="/play" className="text-sm text-gold-300 hover:text-gold-400">
        ← Lobby
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <Image
          src="/images/santa.jpg"
          alt=""
          width={56}
          height={72}
          className="h-14 w-11 rounded-lg object-cover ring-2 ring-cranberry-500/50"
        />
        <h1 className="font-display text-3xl festive-title">Santa or Snow?</h1>
      </div>
      <p className="text-snow-100/70">Balance: {balance.toLocaleString()} 🎁</p>
      <div className="mt-8 flex gap-3">
        {SIDES.map((side) => (
          <button
            key={side.id}
            type="button"
            onClick={() => setChoice(side.id)}
            className={`flex-1 rounded-xl border py-4 transition ${
              choice === side.id
                ? "border-gold-400 bg-gold-400/20 text-gold-300 shadow-[0_0_20px_rgba(250,204,21,0.25)]"
                : "border-holly-600/50 bg-holly-900/70 text-snow-100/80"
            }`}
          >
            <span className="text-3xl">{side.emoji}</span>
            <p className="mt-1 text-sm font-semibold">{side.label}</p>
          </button>
        ))}
      </div>
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
        onClick={flip}
        disabled={loading || balance < 1}
        className="btn-gold mt-4 w-full disabled:opacity-40"
      >
        {loading ? "Flipping…" : "❄️ Flip!"}
      </button>
      {result ? <p className="mt-6 text-center text-lg text-gold-300">{result}</p> : null}
    </main>
  );
}
