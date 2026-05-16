# Atlas Next.js Deployment

Atlas landing page was migrated locally to Next.js 16.2.6 and deployed to Vercel.

## Live site

https://next-app-steel-ten.vercel.app

## Local project path

`C:\Users\sdjur\Documents\Codex\2026-05-09\veris-visual-wireframe-veris-grant-broker\Atlas\next-app`

## Stack

- Next.js 16.2.6
- React
- TypeScript
- App Router
- Next `proxy.ts` language redirect by `Accept-Language`
- Localized pages: EN, UK, ES, RU, DE, PL

## Verified

- `npm run build` completed successfully.
- Vercel production deploy completed successfully.
- Public `/pl` route returned HTTP 200 and contained the Polish slogan `Nie sam. Nie na slepo.`

## Note

The existing GitHub repository `avtooffice-cell/Veris` already contains another project in its root. The Atlas work is therefore being placed under `atlas-next-app/` on the `Atlas` branch to avoid overwriting existing repository content.
