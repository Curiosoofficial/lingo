import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, type NextFetchEvent } from "next/server";

// Next.js 16: "middleware.ts" heisst jetzt "proxy.ts" und läuft in der Node.js-Runtime.
const isPublicRoute = createRouteMatcher(["/", "/api/webhooks/stripe"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

// Eingebettete Demo (z.B. im Portfolio als <iframe>):
// Ohne Cookies leitet Clerk Seitenaufrufe zum "Handshake" auf clerk.accounts.dev
// und zurück. In einem fremden iframe blockiert der Browser diese Cookies, das
// endet in einer Endlosschleife. Clerk macht den Handshake nur bei Seitenaufrufen
// (Sec-Fetch-Dest "document" oder "iframe"). Darum geben wir Anfragen aus einem
// iframe als normale Hintergrund-Anfrage aus: Die Startseite erscheint als Gast,
// Einloggen geht dann im neuen Tab.
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (request.headers.get("sec-fetch-dest") === "iframe") {
    const headers = new Headers(request.headers);
    headers.set("sec-fetch-dest", "empty");
    return clerk(new NextRequest(request, { headers }), event);
  }

  return clerk(request, event);
}

export const config = {
  matcher: [
    // Next.js-Interna und statische Dateien überspringen
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|wav)).*)",
    // API-Routen immer durchlaufen
    "/(api|trpc)(.*)",
    // Clerk-eigene Frontend-API-Routen
    "/__clerk/(.*)",
  ],
};
