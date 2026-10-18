import type { GuestPublic } from "./types";

type Listener = (guests: GuestPublic[]) => void;

const listeners = new Set<Listener>();

export function subscribeLeaderboard(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyLeaderboard(guests: GuestPublic[]): void {
  for (const listener of listeners) {
    listener(guests);
  }
}
