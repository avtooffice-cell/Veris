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

## Latest copy and mobile logo fix

Date: 2026-05-22

Implemented follow-up fixes:

- completed body copy localization for PL, ES, RU, DE, and UK pages;
- confirmed English copy remains only on `/en`;
- fixed mobile header logo overlap by cropping the mobile logo to the square Veris mark only;
- kept mobile header compact with logo mark + language selector + compact CTA.

## Prior visual audit update

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
- Local `/pl`, `/es`, `/ru`, `/de` routes returned HTTP 200.
- Local PL/ES/RU/DE routes no longer contain English hero text or English hero bullets.
- In-app browser mobile check for `/pl`: document language is `pl`, mobile logo width is 48px, no Veris text overlap, hero text is Polish.
- Vercel production deploy completed successfully.
- Public `/pl`, `/es`, `/ru`, `/de`, `/uk` routes no longer contain English hero text or English hero bullets.
- Public `/en` still contains English copy as expected.

## Vercel deployment

Latest production alias:

https://next-app-steel-ten.vercel.app

Latest production deployment URL from CLI:

https://next-6wtl1kftx-avtooffice-cells-projects.vercel.app

## Note

The existing GitHub repository `avtooffice-cell/Veris` already contains another project in its root. Atlas work is being documented under `atlas-next-app/` on the `Atlas` branch to avoid overwriting existing repository content.
