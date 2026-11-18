# Lingo – Sprachen lernen im Duolingo-Stil

> **Tutorial-Projekt, nachgebaut nach Code With Antonio.**
> Grundidee, Aufbau und Design stammen aus seinem Video-Tutorial. Ich habe die App 2024 Schritt für Schritt
> nachprogrammiert, um Next.js (App Router), Server Actions, Drizzle ORM, Clerk und Stripe zu lernen.
> 2026 habe ich sie repariert und auf aktuelle Versionen gehoben (siehe unten).

**Live-Demo:** https://lingo-nine-iota.vercel.app

Lingo ist eine Lern-App für Sprachen nach dem Vorbild von Duolingo: Kurs wählen, Lektionen mit Quiz-Fragen
lösen, Punkte sammeln und Herzen verlieren, wenn eine Antwort falsch ist.

## Funktionen

- Kurse für Spanisch, Französisch, Kroatisch und Italienisch, mit Units und Lektionen
- Quiz mit Auswahl-Fragen, Bildern und Audio (richtige/falsche Antwort mit Ton)
- Fortschritt pro Lektion, Übungsmodus für abgeschlossene Lektionen
- Herzen-System: falsche Antwort kostet ein Herz, im Shop gegen Punkte auffüllbar
- Leaderboard (Top 10 nach Punkten) und Quests (XP-Ziele)
- „Lingo Pro“-Abo über Stripe (Testmodus) für unendlich viele Herzen
- Login mit Clerk (E-Mail oder Google)
- Admin-Bereich unter `/admin` (react-admin) zum Bearbeiten von Kursen, Units, Lektionen und Fragen

## Tech-Stack

- **Next.js 16** (App Router, Server Components, Server Actions), **React 19**, **TypeScript**
- **Tailwind CSS** und **shadcn/ui** (Radix UI)
- **Drizzle ORM** mit **Neon** (serverless Postgres)
- **Clerk** für Login und Benutzerverwaltung
- **Stripe** für das Abo (Checkout, Kundenportal, Webhook)
- **Zustand** für die Modals, **react-admin** für das Admin-Panel
- Hosting auf **Vercel**

## Lokal starten

Voraussetzungen: Node.js 24, ein Konto bei [Neon](https://neon.tech), [Clerk](https://clerk.com) und
[Stripe](https://stripe.com) (alle drei sind für dieses Projekt kostenlos, Stripe nur im Testmodus).

1. Repository klonen und Pakete installieren:

   ```bash
   git clone https://github.com/Curiosoofficial/lingo.git
   cd lingo
   npm install
   ```

2. Umgebungsvariablen anlegen: `.env.example` nach `.env` kopieren und die Werte eintragen.
   Wo man welchen Schlüssel findet, steht als Kommentar in der Datei.

3. Datenbank-Tabellen anlegen und mit Kursen füllen:

   ```bash
   npm run db:push   # Tabellen aus db/schema.ts in Neon anlegen
   npm run db:prod   # 4 Kurse mit Units, Lektionen und Fragen einfügen (löscht vorher alles!)
   ```

4. Entwicklungsserver starten und http://localhost:3000 öffnen:

   ```bash
   npm run dev
   ```

5. Optional, Stripe-Webhook lokal testen (mit der [Stripe CLI](https://docs.stripe.com/stripe-cli)):

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

   Den ausgegebenen `whsec_...` als `STRIPE_WEBHOOK_SECRET` in `.env` eintragen.
   Testkarte im Checkout: `4242 4242 4242 4242`, beliebiges Datum in der Zukunft, beliebige CVC.

Weitere Befehle: `npm run build` (Produktions-Build), `npm run lint` (ESLint), `npm run db:studio`
(Datenbank im Browser ansehen), `npm run db:reset` (alle Tabellen leeren).

## Auf Vercel deployen

1. Projekt in Vercel aus diesem GitHub-Repo importieren (Framework: Next.js, Node.js 24).
2. Unter **Settings > Environment Variables** alle Variablen aus `.env.example` eintragen.
   `NEXT_PUBLIC_APP_URL` ist die Vercel-Adresse, z.B. `https://lingo-nine-iota.vercel.app`.
3. In Stripe unter **Developers > Webhooks** einen Endpoint auf
   `https://<deine-domain>/api/webhooks/stripe` anlegen (Events `checkout.session.completed` und
   `invoice.payment_succeeded`) und dessen Signing Secret als `STRIPE_WEBHOOK_SECRET` setzen.
4. Neu deployen. Wichtig: Neue oder geänderte Variablen gelten erst nach einem neuen Deployment.

## Reparatur 2026: Was kaputt war

Die Live-Seite lieferte nur noch `500: MIDDLEWARE_INVOCATION_FAILED`. Die Vercel-Logs zeigten
`@clerk/nextjs: Missing secretKey`: Die Clerk-Middleware des Deployments vom Juni 2024 fand den geheimen
Schlüssel zur Laufzeit nicht mehr, obwohl er in Vercel eingetragen ist. Datenbank und Clerk-Instanz
liefen dagegen noch. Lokal funktionierte derselbe Code, das Problem lag also im alten Deployment
(Next.js 14.2.3 mit Clerk 5.1.3) auf der heutigen Vercel-Plattform. Ein frischer Build mit aktuellen
Paketen behebt das.

Was ich geändert habe:

- **Sicherheit:** Die Datei `.env` mit allen Schlüsseln war seit dem ersten Commit öffentlich im Repo,
  und das Datenbank-Passwort stand zusätzlich fest im Code (`drizzle.config.ts`, `scripts/seed.ts`,
  `scripts/reset.ts`). <!-- TODO Luka: Satz erst so stehen lassen, wenn Clerk-, Stripe- und Neon-Schlüssel wirklich neu erzeugt sind. -->
  Alle betroffenen Schlüssel (Clerk, Stripe, Neon) wurden neu erzeugt, die Dateien lesen jetzt nur noch
  `process.env`, `.env` ist nicht mehr im Repo und `.env.example` dokumentiert die Variablen ohne Werte.
- **Update auf Next.js 16 und React 19:** Next.js 14 bekommt keine Sicherheits-Updates mehr
  (`npm audit` meldete kritische Lücken). Dafür nötig waren: `middleware.ts` heisst jetzt `proxy.ts`,
  `params`, `headers()` und Clerks `auth()` sind asynchron, `next/dynamic` mit `ssr: false` braucht eine
  Client-Komponente, ESLint läuft mit Flat-Config statt `next lint`.
- **Clerk 7:** `<SignedIn>`/`<SignedOut>` gibt es nicht mehr, dafür `<Show when="signed-in">`.
  `afterSignOutUrl` sitzt jetzt am `ClerkProvider`.
- **Weitere Updates:** Drizzle ORM 0.45, Neon-Treiber 1.x, react-admin 5, Zustand 5, Sonner 2.
  Stripe bleibt bewusst auf Version 15 mit API-Version `2024-04-10`, weil neuere API-Versionen
  `current_period_end` an eine andere Stelle verschoben haben, das der Webhook liest.
- **Bugs:** Der Knopf im Herzen-Modal führte auf `/store` (gibt es nicht) statt `/shop`.
  Nach einer falschen Antwort wurde `/learn/[id]` statt `/lesson/[id]` neu geladen.
  Die Modals nutzten einen `useEffect`-Trick gegen Hydration-Fehler, der mit React 19 als Fehler gilt
  und bei geschlossenen Radix-Dialogen unnötig ist.
- **Einbettung:** Wird die App in einem `<iframe>` eingebettet, überspringt `proxy.ts` Clerks
  Handshake-Weiterleitung, sonst entsteht eine Endlosschleife. Die Startseite erscheint dann als Gast,
  Einloggen geht nur im eigenen Tab.
