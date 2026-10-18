import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
      <SiteHeader
        subtitle="Register on your phone, play games for chips, and compete for the auction prize pool."
      />
      <div className="flex flex-1 flex-col gap-4">
        <Link href="/register" className="btn-gold text-center text-lg">
          Join the party
        </Link>
        <Link
          href="/play"
          className="glass rounded-2xl px-5 py-4 text-center text-lg text-white/90 transition hover:bg-white/10"
        >
          I&apos;m already registered → Play games
        </Link>
        <div className="mt-6 rounded-2xl border border-gold-500/20 bg-pine-900/60 p-5 text-sm text-white/75">
          <p className="font-semibold text-gold-400">For the host</p>
          <p className="mt-2">
            Open{" "}
            <Link href="/dashboard" className="text-gold-400 underline">
              /dashboard
            </Link>{" "}
            on the TV. Use{" "}
            <Link href="/admin" className="text-gold-400 underline">
              /admin
            </Link>{" "}
            to adjust balances during physical games.
          </p>
        </div>
      </div>
    </main>
  );
}
