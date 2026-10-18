import { NextResponse } from "next/server";
import { getGuestIdFromCookies } from "@/lib/auth";
import { getGuestById, settleGame } from "@/lib/db";
import { parseBet, playSlots } from "@/lib/games";

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
  if (bet === null) {
    return NextResponse.json({ error: "Invalid bet" }, { status: 400 });
  }
  const { reels, payout, message } = playSlots(bet);
  const result = settleGame(guestId, bet, payout, `Slots: ${message}`);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({
    reels,
    payout,
    message,
    balance: result.balance,
  });
}
