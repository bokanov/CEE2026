import Link from "next/link";

type Props = {
  title?: string;
  subtitle?: string;
};

export function SiteHeader({ title, subtitle }: Props) {
  return (
    <header className="mb-8 text-center">
      <p className="mb-1 text-sm uppercase tracking-[0.35em] text-gold-500">
        🎄 Holiday Casino
      </p>
      <h1 className="font-display text-3xl font-bold text-gold-400 md:text-4xl">
        {title ?? "Christmas Casino Night"}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-white/70 md:text-base">{subtitle}</p>
      ) : null}
      <nav className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/" className="text-gold-400/90 underline-offset-4 hover:underline">
          Home
        </Link>
        <Link href="/play" className="text-gold-400/90 underline-offset-4 hover:underline">
          Play
        </Link>
        <Link
          href="/dashboard"
          className="text-gold-400/90 underline-offset-4 hover:underline"
        >
          TV Dashboard
        </Link>
        <Link href="/admin" className="text-white/50 underline-offset-4 hover:underline">
          Admin
        </Link>
      </nav>
    </header>
  );
}
