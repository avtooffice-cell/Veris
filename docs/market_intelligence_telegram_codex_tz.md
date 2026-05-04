# Технічне завдання для Codex / OpenClaw Skill

# Market Intelligence Telegram Digest

## 1. Мета

Створити OpenClaw skill для автоматичного збору, оцінки, групування, аналітичної обробки та публікації новин у Telegram-канал.

Система має покривати:

- політику;
- фінанси;
- макроекономіку;
- регуляторику;
- гранти / субсидії;
- податки;
- торгівлю / імпорт;
- банківське середовище;
- вплив на наш ринок: Іспанія, ЄС, імпорт, гранти, фінансово-консультаційні послуги, малий бізнес, експати.

---

## 2. Загальна логіка роботи

### Рівень 1 — Telegram Digest

За вибраним інтервалом система:

1. запускає парсер;
2. збирає матеріали з медіа та інституцій;
3. нормалізує дані;
4. прибирає дублікати;
5. оцінює кожен матеріал за L1–L4;
6. групує новини по темах;
7. формує короткий дайджест;
8. додає наш коментар: "як це впливає на наш ринок";
9. публікує дайджест у Telegram-канал.

### Рівень 2 — Deep Dive

Після дайджесту система:

1. обирає 2–3 найбільш релевантні матеріали;
2. робить окрему аналітику по кожному;
3. публікує окремий пост у Telegram:
   - заголовок;
   - короткий зміст;
   - посилання;
   - оцінка L1–L4;
   - вплив на наш ринок;
   - висновок;
   - рекомендована дія.

---

## 3. Система оцінки L1–L4

### L1 — Institutional / Primary Source

Найвища вага. Первинні інституційні джерела.

Джерела:

- European Commission;
- ECB;
- Banco de España;
- Agencia Tributaria;
- IMF;
- OECD;
- Eurostat;
- WTO;
- BOE;
- CNMV;
- European Parliament;
- Council of the EU.

Приклади тем:

- нові грантові програми;
- зміни податкового режиму;
- макроекономічні прогнози;
- нові регуляції;
- ставки ECB;
- правила імпорту;
- державна допомога.

Scoring weight: `4`

---

### L2 — Tier-1 Financial / Political Media

Авторитетні професійні медіа.

Джерела:

- Financial Times;
- Reuters;
- Bloomberg;
- Wall Street Journal;
- The Economist;
- Expansión;
- Cinco Días;
- El País;
- El Mundo;
- La Vanguardia.

Scoring weight: `3`

---

### L3 — Sector / Regional / Specialist Media

Вузькі джерела.

Приклади:

- Valencia Plaza;
- Alicante Plaza;
- Europa Press;
- Agencia EFE;
- El Economista;
- logistics publications;
- import/export publications;
- regional business media.

Scoring weight: `2`

---

### L4 — Noise / Low Priority

Матеріали з низькою практичною цінністю.

Приклади:

- opinion-only статті;
- політичні заяви без рішення;
- повтори;
- загальні новини без регуляторного або фінансового наслідку;
- неперевірені джерела.

Scoring weight: `1`

---

## 4. Релевантність для нашого ринку

Кожен матеріал має отримати `market_relevance_score` від 0 до 100.

### Критерії

| Критерій | Вага |
|---|---:|
| Вплив на гранти / субсидії | 25 |
| Вплив на податки / compliance | 20 |
| Вплив на імпорт / торгівлю | 20 |
| Вплив на фінансування / кредити | 15 |
| Вплив на малий бізнес / autónomo / SME | 10 |
| Вплив на експатів / іноземців / компанії | 10 |

### Порогові значення

| Score | Дія |
|---:|---|
| 80–100 | включити в deep dive |
| 60–79 | включити в digest |
| 40–59 | тільки якщо мало новин |
| 0–39 | ігнорувати |

---

## 5. Архітектура проєкту

```text
market-intelligence-telegram/
├── SKILL.md
├── README.md
├── requirements.txt
├── .env.example
├── config/
│   ├── sources.yaml
│   ├── keywords.yaml
│   ├── scoring.yaml
│   └── schedule.yaml
├── src/
│   ├── main.py
│   ├── scheduler.py
│   ├── fetchers/
│   │   ├── rss_fetcher.py
│   │   ├── webpage_fetcher.py
│   │   └── institution_fetcher.py
│   ├── processing/
│   │   ├── normalizer.py
│   │   ├── deduplicator.py
│   │   ├── classifier.py
│   │   ├── scorer.py
│   │   └── grouper.py
│   ├── analysis/
│   │   ├── digest_generator.py
│   │   ├── article_analyzer.py
│   │   └── prompts.py
│   ├── telegram/
│   │   └── publisher.py
│   ├── storage/
│   │   ├── sqlite_store.py
│   │   └── schema.sql
│   └── utils/
│       ├── logging.py
│       └── text.py
└── tests/
    ├── test_scoring.py
    ├── test_deduplication.py
    └── test_digest_generation.py
```

---

## 6. SKILL.md

```markdown
---
name: market-intelligence-telegram
description: Collects finance, policy, regulatory and institutional news, scores them by L1-L4 relevance, generates market-impact commentary, and publishes digests to Telegram.
---

# Market Intelligence Telegram Skill

Use this skill to run an automated market intelligence pipeline for Spain, EU and global finance/policy news.

## Capabilities

- Collect news from RSS feeds, institutional pages and configured URLs.
- Classify sources as L1-L4.
- Score each item by business relevance.
- Generate Telegram digest posts.
- Generate 2-3 deep-dive posts for the most relevant articles.
- Publish to a configured Telegram channel.

## Safety rules

- Never expose API keys or Telegram tokens.
- Read credentials only from environment variables.
- Do not execute untrusted remote scripts.
- Do not scrape websites that disallow crawling.
- Always include source links.
- Mark uncertain interpretation as "requires verification".

## Commands

- `python src/main.py run-once`
- `python src/main.py run-scheduler`
- `python src/main.py test-telegram`
- `python src/main.py dry-run`
```

---

## 7. sources.yaml

```yaml
sources:
  - name: "European Commission"
    level: "L1"
    type: "institution"
    region: "EU"
    topics: ["grants", "regulation", "state_aid", "funding"]
    urls:
      - "https://ec.europa.eu/commission/presscorner/home/en"
      - "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home"

  - name: "European Central Bank"
    level: "L1"
    type: "institution"
    region: "EU"
    topics: ["rates", "inflation", "monetary_policy"]
    urls:
      - "https://www.ecb.europa.eu/press/html/index.en.html"

  - name: "Banco de España"
    level: "L1"
    type: "institution"
    region: "Spain"
    topics: ["banking", "macro", "credit"]
    urls:
      - "https://www.bde.es/wbe/en/noticias-eventos/"

  - name: "Agencia Tributaria"
    level: "L1"
    type: "institution"
    region: "Spain"
    topics: ["tax", "iva", "compliance"]
    urls:
      - "https://sede.agenciatributaria.gob.es/"

  - name: "IMF"
    level: "L1"
    type: "institution"
    region: "Global"
    topics: ["macro", "risk", "forecast"]
    urls:
      - "https://www.imf.org/en/Publications/WEO"

  - name: "Reuters Business"
    level: "L2"
    type: "rss"
    region: "Global"
    topics: ["business", "markets", "macro"]
    rss:
      - "https://www.reuters.com/markets/"

  - name: "Financial Times"
    level: "L2"
    type: "rss"
    region: "EU/Global"
    topics: ["finance", "policy", "markets"]

  - name: "Expansion"
    level: "L2"
    type: "rss"
    region: "Spain"
    topics: ["business", "tax", "finance"]

  - name: "Cinco Dias"
    level: "L2"
    type: "rss"
    region: "Spain"
    topics: ["economy", "tax", "policy"]

  - name: "El Pais Economia"
    level: "L2"
    type: "rss"
    region: "Spain"
    topics: ["politics", "economy"]
```

---

## 8. keywords.yaml

```yaml
priority_keywords:
  grants:
    - grant
    - subsidy
    - subvención
    - ayuda
    - fondos europeos
    - NextGenerationEU
    - financiación
    - funding
    - convocatoria

  tax:
    - tax
    - impuesto
    - IVA
    - autónomo
    - IRPF
    - sociedades
    - Agencia Tributaria
    - compliance

  trade:
    - import
    - export
    - tariff
    - arancel
    - aduana
    - customs
    - logistics
    - supply chain

  finance:
    - ECB
    - interest rates
    - inflation
    - credit
    - loan
    - liquidity
    - bank lending
    - euribor

  politics:
    - government
    - parliament
    - regulation
    - reform
    - decree
    - BOE
    - law
    - directive
    - regulation

market_terms:
  - Spain
  - España
  - European Union
  - EU
  - SME
  - pyme
  - autónomo
  - Alicante
  - Valencia
  - importers
  - foreign companies
  - expats
```

---

## 9. scoring.yaml

```yaml
source_level_weights:
  L1: 4
  L2: 3
  L3: 2
  L4: 1

market_relevance_weights:
  grants: 25
  tax: 20
  trade: 20
  finance: 15
  sme: 10
  expats: 10

minimum_digest_score: 60
minimum_deep_dive_score: 80
max_deep_dive_articles: 3
min_deep_dive_articles: 2
```

---

## 10. schedule.yaml

```yaml
timezone: "Europe/Madrid"

jobs:
  digest:
    enabled: true
    interval_minutes: 180
    quiet_hours:
      start: "22:00"
      end: "07:00"

  deep_dive:
    enabled: true
    run_after_digest: true
    max_articles: 3
```

---

## 11. Telegram формат

### Digest post

```text
📊 Finance & Policy Digest — {date}

Коротко: {1-2 речення загального висновку}

1. {title}
Джерело: {source} / {L-level}
Вплив: {impact_summary}
Ринок: {market_relevance_score}/100
Посилання: {url}

2. {title}
...

Висновок:
{overall_market_comment}

Що робити:
- {action_1}
- {action_2}
- {action_3}
```

### Deep Dive post

```text
🔎 Deep Dive: {title}

Джерело: {source}
Рівень: {L1/L2/L3/L4}
Релевантність: {score}/100

Що сталося:
{summary}

Чому це важливо:
{business_impact}

Вплив на наш ринок:
{market_commentary}

Ризики:
{risks}

Практичний висновок:
{conclusion}

Рекомендована дія:
{recommended_action}

Посилання:
{url}
```

---

## 12. Prompt для digest

```text
You are a market intelligence analyst for a Spain-based business focused on imports, grants, tax advisory, financial intermediation, SME services, and expat business support.

Analyze the following news items.

For each item:
1. Summarize the key fact in 1-2 sentences.
2. Identify the source level: L1, L2, L3, or L4.
3. Estimate market relevance from 0 to 100.
4. Explain the impact on our market:
   - Spain
   - EU
   - imports
   - grants/subsidies
   - tax/compliance
   - SME/autónomo
   - expat business clients
5. Flag uncertainty if the article is opinion-based or lacks primary confirmation.

Do not overstate impact.
Do not invent facts.
Separate factual content from interpretation.
Return concise Ukrainian output suitable for Telegram.
```

---

## 13. Prompt для deep dive

```text
You are preparing a deep-dive Telegram post for a finance and policy intelligence channel.

Article:
{article_text}

Source:
{source_name}

Source level:
{source_level}

Business context:
We operate in Spain and monitor policy, finance, grants, tax, imports, SME/autónomo market, foreign companies, and expat business opportunities.

Tasks:
1. Extract the core factual claim.
2. Explain why this article matters.
3. Assess the direct and indirect impact on our market.
4. Identify risks and second-order effects.
5. Provide a practical conclusion.
6. Recommend one concrete business action.
7. Keep the style concise, analytical, and direct.
8. Do not add unsupported facts.
9. If article content is weak, say so directly.

Output in Ukrainian.
```

---

## 14. SQLite schema

### articles

```sql
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_name TEXT,
    source_level TEXT,
    title TEXT,
    url TEXT UNIQUE,
    published_at TEXT,
    fetched_at TEXT,
    raw_summary TEXT,
    full_text TEXT,
    language TEXT,
    category TEXT,
    market_relevance_score INTEGER,
    digest_included BOOLEAN DEFAULT 0,
    deep_dive_included BOOLEAN DEFAULT 0,
    content_hash TEXT
);
```

### runs

```sql
CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT,
    finished_at TEXT,
    status TEXT,
    articles_fetched INTEGER,
    articles_selected INTEGER,
    digest_sent BOOLEAN,
    error TEXT
);
```

---

## 15. Deduplication

Система має прибирати дублікати за:

1. URL;
2. normalized title;
3. content hash;
4. similarity score > 0.85.

Якщо Reuters, FT і El País пишуть про одне й те саме, залишати:

- L1, якщо є первинне джерело;
- інакше L2 з найвищим рівнем довіри;
- інші зберігати як `related_sources`.

---

## 16. Безпека

`.env.example`:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHANNEL_ID=
OPENAI_API_KEY=
DATABASE_URL=sqlite:///market_intelligence.db
```

Заборонено:

- hardcode токенів;
- публікувати `.env`;
- логувати API keys;
- виконувати remote shell scripts;
- обходити paywall;
- копіювати повні платні статті.

---

## 17. CLI команди

```bash
python src/main.py run-once
python src/main.py run-scheduler
python src/main.py dry-run
python src/main.py test-telegram
```

---

## 18. Acceptance criteria

Codex має реалізувати так, щоб:

- `run-once` збирає новини;
- новини зберігаються в SQLite;
- дублікати видаляються;
- кожна новина отримує L1–L4;
- кожна новина отримує relevance score;
- digest формується українською;
- Telegram test message відправляється;
- digest відправляється в Telegram;
- deep dive публікує максимум 3 окремі пости;
- dry-run показує результат без відправки;
- errors логуються;
- повторний запуск не публікує ті самі статті.

---

## 19. Команда для Codex

```text
Create an OpenClaw skill named market-intelligence-telegram.

Implement the full project according to the technical specification below.

Requirements:
- Python 3.11+
- SQLite storage
- YAML-based configuration
- RSS and webpage fetching
- Telegram Bot API publishing
- scheduler with configurable interval
- L1-L4 source scoring
- market relevance scoring from 0 to 100
- Ukrainian Telegram digest generation
- Ukrainian deep-dive article posts
- dry-run mode
- test-telegram mode
- no hardcoded secrets
- robust logging
- basic unit tests

Do not bypass paywalls.
Do not scrape websites that disallow crawling.
Do not expose API keys.
Use environment variables for secrets.
Create a clean modular architecture.

Generate:
1. Full folder structure
2. SKILL.md
3. README.md
4. requirements.txt
5. .env.example
6. config files
7. source code
8. tests
9. setup instructions
10. example Telegram output
```

---

## 20. Обмеження першої версії

Не робити:

- 100 джерел одразу;
- обхід paywall;
- автопублікацію без `dry-run`;
- повний scraping Bloomberg / FT / WSJ без легального API або RSS;
- LLM-only scoring без фіксованих правил у `scoring.yaml`.

Перша версія має бути стабільною, контрольованою і придатною до розширення. Не треба будувати космічний корабель, коли ще не заведений двигун.
