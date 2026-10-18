import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth";
import { adjustBalance } from "@/lib/db";

export async function POST(request: Request) {
  const jar = await cookies();
  if (!jar.get(ADMIN_COOKIE)?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const guestId = String(body.guestId ?? "");
  const delta = parseInt(String(body.delta), 10);
  const reason = String(body.reason ?? "Host adjustment");
  if (!guestId || !Number.isFinite(delta) || delta === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const guest = adjustBalance(guestId, delta, reason);
  if (!guest) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }
  return NextResponse.json({ balance: guest.balance });
}
