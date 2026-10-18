import { NextResponse } from "next/server";
import { getGuestIdFromCookies } from "@/lib/auth";
import { getGuestById, rowToPublic } from "@/lib/db";

export async function GET() {
  const id = await getGuestIdFromCookies();
  if (!id) {
    return NextResponse.json({ guest: null });
  }
  const row = getGuestById(id);
  if (!row) {
    return NextResponse.json({ guest: null });
  }
  return NextResponse.json({ guest: rowToPublic(row, 0) });
}
