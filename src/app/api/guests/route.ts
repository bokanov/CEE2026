import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/auth";
import { listGuestsPublic } from "@/lib/db";

export async function GET() {
  const jar = await cookies();
  if (!jar.get(ADMIN_COOKIE)?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ guests: listGuestsPublic() });
}
