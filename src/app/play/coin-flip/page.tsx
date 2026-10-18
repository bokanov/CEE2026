"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
      setResult(
        data.won
          ? `🎉 ${data.side}! You won ${data.payout} chips!`
          : `💫 It was ${data.side}. You lost ${bet} chips.`,
      );
    } catch {
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-8">
      <Link href="/play" className="text-sm text-gold-400">← Lobby</Link>
      <h1 className="mt-4 font-display text-3xl text-gold-400">Coin Flip</h1>
      <p className="text-white/60">Balance: {balance.toLocaleString()} 🪙</p>
      <div className="mt-8 flex gap-3">
        {(["heads", "tails"] as const).map((side) => (
          <button
            key={side}
            type="button"
            onClick={() => setChoice(side)}
            className={`flex-1 rounded-xl border py-4 capitalize ${
              choice === side
                ? "border-gold-500 bg-gold-500/20 text-gold-400"
                : "border-white/15 bg-pine-900/60"
            }`}
          >
            {side}
          </button>
        ))}
      </div>
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
        onClick={flip}
        disabled={loading || balance < 1}
        className="btn-gold mt-4 w-full disabled:opacity-40"
      >
        {loading ? "Flipping…" : "Flip!"}
      </button>
      {result ? <p className="mt-6 text-center text-lg text-gold-400">{result}</p> : null}
    </main>
  );
}
