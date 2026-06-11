# scoring_01

Скорингова модель Veris для попередньої оцінки клієнта.

## Stack

- Vite
- React
- CSS
- Supabase REST API для збереження карт клієнтів
- Vercel для деплою

## Local Development

```powershell
npm install
npm run dev
```

Локальна адреса:

```text
http://127.0.0.1:5173/
```

## Supabase

Фронтенд працює без Supabase і зберігає чернетку в браузері. Щоб увімкнути збереження в базу, додайте змінні:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Схема бази:

```text
supabase/migrations/20260609192000_create_client_scoring_cases.sql
```

Політика доступу:

- `anon` може тільки створювати записи;
- `authenticated` може читати й оновлювати карти;
- публічне читання клієнтських даних не відкривається.

## Build

```powershell
npm run build
```

## Google Sheets sync

Production flow:

```text
React app -> Supabase client_scoring_cases -> /api/sync-google-sheet -> Google Apps Script -> Google Sheet
```

`/api/sync-google-sheet` is called after a successful Supabase insert. On Vercel Hobby, the fallback Cron runs daily; on Vercel Pro, the schedule can be changed to every 5 minutes.

Required Vercel environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GOOGLE_SHEETS_WEBHOOK_URL
```

`SUPABASE_SERVICE_ROLE_KEY` must be server-only. Do not add it with a `VITE_` prefix.

Run this migration in Supabase before enabling sync:

```text
supabase/migrations/20260610021000_add_google_sheet_sync_fields.sql
```
