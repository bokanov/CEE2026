import { NextResponse } from "next/server";
import { getGuestById, readGuestPhoto } from "@/lib/db";
import path from "path";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const guest = getGuestById(id);
  if (!guest?.photo_path) {
    return new NextResponse(null, { status: 404 });
  }
  const buffer = readGuestPhoto(guest.photo_path);
  if (!buffer) {
    return new NextResponse(null, { status: 404 });
  }
  const ext = path.extname(guest.photo_path).toLowerCase();
  const type =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : ext === ".gif"
          ? "image/gif"
          : "image/jpeg";
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
