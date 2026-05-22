# Atlas Next.js Deployment

Atlas landing page was migrated locally to Next.js 16.2.6 and deployed to Vercel.

## Live site

https://next-app-steel-ten.vercel.app

Language pages:

- https://next-app-steel-ten.vercel.app/en
- https://next-app-steel-ten.vercel.app/uk
- https://next-app-steel-ten.vercel.app/es
- https://next-app-steel-ten.vercel.app/ru
- https://next-app-steel-ten.vercel.app/de
- https://next-app-steel-ten.vercel.app/pl

## Latest visual audit update

Date: 2026-05-22

Implemented recommendations from `Veris Atlas visual audit — 2026-05-22`:

- localized Ukrainian form labels and section eyebrows;
- set client-side document language from the active route;
- removed unfinished `+34 ...` phone placeholder;
- replaced fake Telegram CTA with `mailto:info@veris.es`;
- made legal footer items non-live while legal pages are not ready;
- tightened mobile header to logo + language + compact CTA;
- rebuilt the hero visual as an Atlas product-preview panel with score ring, risk bars, checklist, and recommendation chip;
- added restrained grid/paper hero background;
- added card hover depth and small markers/icons;
- added lead-section mini checklist;
- added mobile sticky CTA;
- added one-time scroll reveal and FAQ open animation.

## Local project path

`C:\Users\sdjur\Documents\Codex\2026-05-09\veris-visual-wireframe-veris-grant-broker\Atlas\next-app`

## Changed local files for this update

- `components/MarketingLandingPage.tsx`
- `components/PageRuntime.tsx`
- `app/globals.css`

## Stack

- Next.js 16.2.6
- React
- TypeScript
- App Router
- Next `proxy.ts` language redirect by `Accept-Language`
- Supported pages: EN, UK, ES, RU, DE, PL

## Verified

- `npm run build` completed successfully locally.
- Local `/uk` route returned HTTP 200.
- Local `/uk` contains Ukrainian `Статус` and `Проблема` labels.
- Local `/uk` contains the new hero product-preview panel and mobile sticky CTA.
- In-app browser mobile check: `/uk` document language becomes `uk`, mobile header height is about 71px, login is hidden on mobile, sticky CTA is visible.
- Vercel production deploy completed successfully.
- Public `/en`, `/uk`, `/es`, `/ru`, `/de`, `/pl` routes returned HTTP 200.
- Public language routes contain the lead-check section and hero product preview.
- Public language routes no longer contain `+34 ...` or `https://t.me/` placeholders.

## Vercel deployment

Latest production alias:

https://next-app-steel-ten.vercel.app

Latest production deployment URL from CLI:

https://next-kbss1uer6-avtooffice-cells-projects.vercel.app

## Note

The existing GitHub repository `avtooffice-cell/Veris` already contains another project in its root. Atlas work is being documented under `atlas-next-app/` on the `Atlas` branch to avoid overwriting existing repository content.
