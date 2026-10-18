import { listGuestsPublic } from "@/lib/db";
import { subscribeLeaderboard } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let cleanup: (() => void) | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (guests: ReturnType<typeof listGuestsPublic>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ guests })}\n\n`),
        );
      };
      send(listGuestsPublic());
      cleanup = subscribeLeaderboard(send);
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": ping\n\n"));
        } catch {
          clearInterval(heartbeat);
        }
      }, 15000);
      const origCleanup = cleanup;
      cleanup = () => {
        clearInterval(heartbeat);
        origCleanup?.();
      };
    },
    cancel() {
      cleanup?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
