import Image from "next/image";
import Link from "next/link";
import { EVENT_NAME, EVENT_TAGLINE } from "@/lib/branding";

type Props = {
  title?: string;
  subtitle?: string;
};

export function SiteHeader({ title, subtitle }: Props) {
  const showEventTitle = !title;

  return (
    <header className="mb-8 text-center">
      <div className="relative mx-auto mb-4 flex max-w-md items-center justify-center gap-3">
        <Image
          src="/images/christmas-tree.jpg"
          alt=""
          width={72}
          height={96}
          className="h-16 w-12 rounded-lg object-cover ring-2 ring-gold-400/60 shadow-lg sm:h-20 sm:w-16"
        />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cranberry-400 sm:tracking-[0.28em]">
          {EVENT_TAGLINE}
        </p>
        <Image
          src="/images/santa.jpg"
          alt=""
          width={72}
          height={96}
          className="h-16 w-12 rounded-lg object-cover ring-2 ring-cranberry-500/50 shadow-lg sm:h-20 sm:w-16"
        />
      </div>
      <h1 className="font-display text-3xl font-bold festive-title md:text-4xl">
        {showEventTitle ? EVENT_NAME : title}
      </h1>
      {showEventTitle ? (
        <p className="mt-1 text-xs uppercase tracking-[0.35em] text-gold-400/90">
          🎅 ❄️ 🎄
        </p>
      ) : null}
      {subtitle ? (
        <p className="mt-2 text-sm text-snow-100/80 md:text-base">{subtitle}</p>
      ) : null}
      <nav className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
        <Link
          href="/"
          className="text-gold-300 underline-offset-4 hover:text-gold-400 hover:underline"
        >
          Home
        </Link>
        <Link
          href="/play"
          className="text-gold-300 underline-offset-4 hover:text-gold-400 hover:underline"
        >
          Play
        </Link>
        <Link
          href="/dashboard"
          className="text-gold-300 underline-offset-4 hover:text-gold-400 hover:underline"
        >
          TV Dashboard
        </Link>
        <Link
          href="/admin"
          className="text-snow-100/50 underline-offset-4 hover:text-snow-100/80 hover:underline"
        >
          Admin
        </Link>
      </nav>
    </header>
  );
}
