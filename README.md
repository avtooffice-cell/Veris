# Market Intelligence Telegram Digest

Automated market intelligence pipeline for Spain, EU, finance, policy, grants, tax, import/trade, banking, SME/autónomo, and expat business news.

## What It Does

- fetches RSS/Atom feeds and allowed institutional webpages;
- normalizes articles;
- removes duplicates;
- assigns L1-L4 source level;
- scores market relevance from 0 to 100;
- stores articles and runs in SQLite;
- generates Ukrainian Telegram digest text;
- generates up to 3 Ukrainian deep-dive posts;
- supports dry-run, Telegram test message, one-shot runs, and interval scheduler.

## Setup

```powershell
cd .\market-intelligence-telegram
copy .env.example .env
```

Fill `.env`:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
DATABASE_URL=sqlite:///market_intelligence.db
```

Optional dependency:

```powershell
python -m pip install -r requirements.txt
```

The code includes a minimal YAML fallback for the shipped config files, so tests can run even before PyYAML is installed.

## Commands

```powershell
python .\src\main.py dry-run
python .\src\main.py run-once
python .\src\main.py run-scheduler
python .\src\main.py test-telegram
```

`dry-run` does not publish to Telegram and does not write new articles. Use it before `run-once`.

## GitHub Repository Helper

If GitHub CLI is not installed, create the remote repository with a token:

```powershell
$env:GITHUB_TOKEN = "github_pat_..."
.\scripts\create_github_repo.ps1 -RepoName "Telegramm-Veris" -Private
```

## Configuration

- `config/sources.yaml`: source names, L1-L4 level, type, region, topics, RSS URLs, webpage URLs.
- `config/keywords.yaml`: keyword groups for grants, tax, trade, finance, politics, SME, expats.
- `config/scoring.yaml`: source level weights, market relevance weights, thresholds.
- `config/schedule.yaml`: scheduler interval and quiet hours.

## Example Telegram Output

```text
📊 Finance & Policy Digest — 2026-05-04

Коротко: у фокусі grants, tax. Найважливіше — відстежити практичний вплив на клієнтів в Іспанії, імпорт, гранти, податки та фінансування.

1. New grant call for SME digitalization
Джерело: European Commission / L1
Вплив: може змінити доступність грантів, субсидій або державної допомоги.
Ринок: 87/100
Посилання: https://example.com/source

Висновок:
Публікувати варто лише ті матеріали, де є прямий фінансовий, регуляторний або операційний наслідок.

Що робити:
- Перевірити, чи можна швидко підготувати клієнтів до нових заявок.
```

## Safety

No secrets are hardcoded. The pipeline does not bypass paywalls and checks robots.txt for webpage fetching. Always prefer official RSS/API feeds or primary institutional pages.
