"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";

export default function RegisterPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onFileChange() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Please enter your name (at least 2 characters).");
      return;
    }
    const file = fileRef.current?.files?.[0];
    setLoading(true);
    try {
      const form = new FormData();
      form.set("name", trimmed);
      if (file) form.set("photo", file);
      const res = await fetch("/api/register", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        return;
      }
      router.push("/play");
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-lg px-5 py-10">
      <SiteHeader title="Join the game night" subtitle="Name + selfie for the TV leaderboard" />
      <form onSubmit={onSubmit} className="glass animate-slide-up space-y-5 rounded-2xl p-6">
        <label className="block">
          <span className="text-sm text-white/70">Your name</span>
          <input
            className="mt-2 w-full rounded-xl border border-white/15 bg-pine-900/80 px-4 py-3 text-lg outline-none ring-gold-500/40 focus:ring-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            maxLength={40}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="text-sm text-white/70">Photo (for the TV board)</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={onFileChange}
            className="mt-2 w-full text-sm text-white/80 file:mr-3 file:rounded-lg file:border-0 file:bg-gold-500 file:px-4 file:py-2 file:font-semibold file:text-pine-950"
          />
        </label>
        {preview ? (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 rounded-full border-4 border-gold-500/50 object-cover"
            />
          </div>
        ) : null}
        {error ? <p className="text-sm text-cranberry-500">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
          {loading ? "Saving…" : "Get my chips"}
        </button>
      </form>
    </main>
  );
}
