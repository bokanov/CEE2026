export const SLOT_SYMBOLS = ["🎄", "🎅", "⭐", "🔔", "🎁", "❄️"] as const;

/** Weighted random symbol for slots */
export function spinSlotReel(): string {
  const weights = [28, 22, 18, 12, 12, 8];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < SLOT_SYMBOLS.length; i++) {
    r -= weights[i];
    if (r <= 0) return SLOT_SYMBOLS[i];
  }
  return SLOT_SYMBOLS[0];
}

export type SlotResult = {
  reels: [string, string, string];
  payout: number;
  message: string;
};

export function playSlots(bet: number): SlotResult {
  const reels: [string, string, string] = [
    spinSlotReel(),
    spinSlotReel(),
    spinSlotReel(),
  ];
  const [a, b, c] = reels;
  let payout = 0;
  let message = "No match — better luck next spin!";

  if (a === b && b === c) {
    if (a === "⭐") {
      payout = bet * 10;
      message = "STAR JACKPOT! Triple stars!";
    } else if (a === "🎁") {
      payout = bet * 6;
      message = "Triple presents!";
    } else if (a === "🎅") {
      payout = bet * 8;
      message = "Santa sighting! Triple Santas!";
    } else {
      payout = bet * 4;
      message = "Triple match!";
    }
  } else if (a === b || b === c || a === c) {
    payout = Math.floor(bet * 1.5);
    message = "Pair — small win!";
  }

  return { reels, payout, message };
}

export type CoinFlipResult = {
  side: "heads" | "tails";
  won: boolean;
  payout: number;
};

export function playCoinFlip(
  bet: number,
  choice: "heads" | "tails",
): CoinFlipResult {
  const side: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails";
  const won = side === choice;
  return {
    side,
    won,
    payout: won ? bet * 2 : 0,
  };
}

export function parseBet(raw: unknown, maxBalance: number): number | null {
  const bet = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  if (!Number.isFinite(bet) || bet < 1) return null;
  if (bet > maxBalance) return null;
  return bet;
}
