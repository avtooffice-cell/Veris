# Atlas Next.js Deployment

Atlas landing page was migrated locally to Next.js 16.2.6 and deployed to Vercel.

## Live site

https://next-app-steel-ten.vercel.app

Primary marketing page:

https://next-app-steel-ten.vercel.app/uk

## Latest marketing update

Date: 2026-05-22

The Ukrainian `/uk` landing page was rebuilt around the marketer's conversion architecture:

- new hero with two CTA paths;
- high-positioned lead-check form;
- audience block for autonomo, small business, expats, and technology projects;
- problem block explaining grant-fit risk;
- `How Atlas works` section;
- `What Atlas scores` section;
- `What you get after scoring` section;
- before/after Atlas comparison;
- Atlas Scoring vs Veris Advisory cards;
- compliance block;
- updated packages: `€99` single scoring and `€198` strategic package;
- shortened CEO message;
- FAQ;
- final CTA.

## Local project path

`C:\Users\sdjur\Documents\Codex\2026-05-09\veris-visual-wireframe-veris-grant-broker\Atlas\next-app`

## Changed local files for this update

- `app/[lang]/page.tsx`
- `components/UkrainianMarketingPage.tsx`
- `app/globals.css`

## Stack

- Next.js 16.2.6
- React
- TypeScript
- App Router
- Next `proxy.ts` language redirect by `Accept-Language`
- Localized pages: EN, UK, ES, RU, DE, PL

## Verified

- `npm run build` completed successfully locally.
- Vercel production deploy completed successfully.
- Public `/uk` route returned HTTP 200.
- Public `/uk` contains the new hero, lead-check form, FAQ, and package plan links.

## Vercel deployment

Latest production alias:

https://next-app-steel-ten.vercel.app

Latest production deployment URL from CLI:

https://next-bweck3smu-avtooffice-cells-projects.vercel.app

## Note

The existing GitHub repository `avtooffice-cell/Veris` already contains another project in its root. Atlas work is being documented under `atlas-next-app/` on the `Atlas` branch to avoid overwriting existing repository content.
