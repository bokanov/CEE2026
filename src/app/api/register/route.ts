import { NextResponse } from "next/server";
import { GUEST_COOKIE } from "@/lib/auth";
import { createGuest, saveGuestPhoto } from "@/lib/db";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 40) {
    return NextResponse.json({ error: "Invalid name." }, { status: 400 });
  }

  const photo = form.get("photo");
  const allowNoPhoto = process.env.ALLOW_REGISTRATION_WITHOUT_PHOTO === "true";

  if (!(photo instanceof File) || photo.size === 0) {
    if (!allowNoPhoto) {
      return NextResponse.json({ error: "Please add a photo." }, { status: 400 });
    }
    const guest = createGuest(name, null);
    const res = NextResponse.json({ ok: true, guestId: guest.id });
    res.cookies.set(GUEST_COOKIE, guest.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  if (photo.size > MAX_BYTES) {
    return NextResponse.json({ error: "Photo too large (max 5MB)." }, { status: 400 });
  }

  const ext = path.extname(photo.name).toLowerCase() || ".jpg";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (!allowed.includes(ext)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const guest = createGuest(name, null);
  const buffer = Buffer.from(await photo.arrayBuffer());
  saveGuestPhoto(guest.id, ext, buffer);

  const res = NextResponse.json({ ok: true, guestId: guest.id });
  res.cookies.set(GUEST_COOKIE, guest.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
