import Image from "next/image";

const SNOWFLAKES = [
  { left: "4%", delay: "0s", duration: "14s", size: 10 },
  { left: "12%", delay: "2s", duration: "18s", size: 8 },
  { left: "22%", delay: "1s", duration: "16s", size: 12 },
  { left: "35%", delay: "3s", duration: "20s", size: 9 },
  { left: "48%", delay: "0.5s", duration: "15s", size: 11 },
  { left: "58%", delay: "4s", duration: "17s", size: 7 },
  { left: "68%", delay: "1.5s", duration: "19s", size: 10 },
  { left: "78%", delay: "2.5s", duration: "16s", size: 8 },
  { left: "88%", delay: "0.8s", duration: "21s", size: 12 },
  { left: "95%", delay: "3.5s", duration: "14s", size: 9 },
];

export function ChristmasBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url(/images/snow.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-holly-950/85 via-holly-900/75 to-holly-950/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(220,38,38,0.35),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_0%_100%,rgba(34,197,94,0.2),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_100%_100%,rgba(250,204,21,0.15),transparent_50%)]" />

      <Image
        src="/images/christmas-tree.jpg"
        alt=""
        width={280}
        height={380}
        className="absolute -bottom-4 -left-6 hidden w-44 opacity-90 drop-shadow-[0_0_24px_rgba(34,197,94,0.4)] sm:block md:w-56 lg:w-64"
        priority
      />
      <Image
        src="/images/santa.jpg"
        alt=""
        width={260}
        height={320}
        className="absolute -bottom-2 -right-4 hidden w-40 opacity-95 drop-shadow-[0_0_28px_rgba(220,38,38,0.35)] sm:block md:w-52 lg:w-60"
        priority
      />

      {SNOWFLAKES.map((flake, i) => (
        <span
          key={i}
          className="snowflake absolute top-0 text-white/70"
          style={{
            left: flake.left,
            fontSize: flake.size,
            animationDelay: flake.delay,
            animationDuration: flake.duration,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}
