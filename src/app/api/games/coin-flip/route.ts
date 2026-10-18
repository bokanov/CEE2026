import { NextResponse } from "next/server";
import { getGuestIdFromCookies } from "@/lib/auth";
import { getGuestById, settleGame } from "@/lib/db";
import { parseBet, playCoinFlip } from "@/lib/games";

export async function POST(request: Request) {
  const guestId = await getGuestIdFromCookies();
  if (!guestId) {
    return NextResponse.json({ error: "Not registered" }, { status: 401 });
  }
  const guest = getGuestById(guestId);
  if (!guest) {
    return NextResponse.json({ error: "Not registered" }, { status: 401 });
  }
  const body = await request.json();
  const bet = parseBet(body.bet, guest.balance);
  const choice = body.choice === "tails" ? "tails" : "heads";
  if (bet === null) {
    return NextResponse.json({ error: "Invalid bet" }, { status: 400 });
  }
  const { side, won, payout } = playCoinFlip(bet, choice);
  const result = settleGame(
    guestId,
    bet,
    payout,
    won ? `Coin flip win (${side})` : `Coin flip loss (${side})`,
  );
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({
    side,
    won,
    payout,
    balance: result.balance,
  });
}
