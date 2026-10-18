import { cookies } from "next/headers";

export const GUEST_COOKIE = "ccn_guest";
export const ADMIN_COOKIE = "ccn_admin";

export async function getGuestIdFromCookies(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(GUEST_COOKIE)?.value ?? null;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "party-admin";
  return password === expected;
}
