import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
      <SiteHeader
        subtitle="Register on your phone, play games for chips, and compete for the auction prize pool."
      />
      <div className="relative mb-6 overflow-hidden rounded-2xl border-2 border-gold-400/40 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
        <Image
          src="/images/snow.jpg"
          alt="Snowy winter scene"
          width={640}
          height={280}
          className="h-36 w-full object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-holly-950/90 via-holly-950/20 to-transparent" />
        <p className="absolute bottom-3 left-4 right-4 text-center font-display text-lg font-semibold text-snow-50 drop-shadow-md">
          Warm up for the big night — game on!
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <Link href="/register" className="btn-gold text-center text-lg">
          🎄 Join the party
        </Link>
        <Link
          href="/play"
          className="glass rounded-2xl px-5 py-4 text-center text-lg text-snow-50/95 transition hover:border-gold-400/40 hover:bg-holly-800/60"
        >
          I&apos;m already registered → Play games
        </Link>
        <div className="mt-6 rounded-2xl border border-holly-600/50 bg-holly-900/80 p-5 text-sm text-snow-100/80">
          <p className="font-semibold text-gold-300">For the host</p>
          <p className="mt-2">
            Open{" "}
            <Link href="/dashboard" className="text-gold-300 underline">
              /dashboard
            </Link>{" "}
            on the TV. Use{" "}
            <Link href="/admin" className="text-gold-300 underline">
              /admin
            </Link>{" "}
            to adjust balances during physical games.
          </p>
        </div>
      </div>
    </main>
  );
}
