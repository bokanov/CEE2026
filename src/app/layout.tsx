import type { Metadata, Viewport } from "next";
import { ChristmasBackdrop } from "@/components/ChristmasBackdrop";
import { EVENT_NAME } from "@/lib/branding";
import "./globals.css";

export const metadata: Metadata = {
  title: EVENT_NAME,
  description: "December 23 game night — party chips, games, and auction leaderboard",
};

export const viewport: Viewport = {
  themeColor: "#052e16",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ChristmasBackdrop />
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
