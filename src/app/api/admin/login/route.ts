import { NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password ?? "");
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
