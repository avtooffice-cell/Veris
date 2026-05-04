---
name: market-intelligence-telegram
description: Collect, score, analyze, and publish Spain/EU market intelligence news to Telegram. Use when Codex needs to run or extend an RSS/webpage pipeline for finance, policy, grants, tax, imports, SME/autónomo, expat business support, L1-L4 source scoring, Ukrainian digests, deep-dive posts, SQLite storage, Telegram Bot API publishing, dry-run checks, or scheduler automation.
---

# Market Intelligence Telegram Skill

Use this skill to operate or extend the `market-intelligence-telegram` pipeline.

## Workflow

1. Load `.env` and YAML config from `config/`.
2. Fetch configured RSS feeds and allowed institutional pages.
3. Normalize article data and store new items in SQLite.
4. Deduplicate by URL, normalized title, content hash, and title similarity.
5. Classify source level L1-L4 and category.
6. Score `market_relevance_score` from fixed rules in `config/scoring.yaml`.
7. Generate a Ukrainian digest and up to three deep-dive posts.
8. Publish through Telegram only when running `run-once`; use `dry-run` first.

## Commands

Run from this folder:

```powershell
python .\src\main.py dry-run
python .\src\main.py run-once
python .\src\main.py run-scheduler
python .\src\main.py test-telegram
```

## Safety Rules

- Never hardcode or print Telegram/OpenAI secrets.
- Read credentials from `.env` or environment variables only.
- Do not bypass paywalls or copy full paid articles.
- Do not execute remote scripts.
- Check robots.txt before webpage fetching.
- Always keep source links in Telegram output.
- Treat non-L1 interpretation as requiring verification.

## Files To Inspect

- `config/sources.yaml`: sources, levels, regions, topics, RSS URLs, webpage URLs.
- `config/keywords.yaml`: fixed keyword categories for classifier and scorer.
- `config/scoring.yaml`: source weights, relevance weights, digest/deep-dive thresholds.
- `src/pipeline.py`: end-to-end orchestration.
- `src/storage/schema.sql`: SQLite schema.
- `src/analysis/digest_generator.py`: Ukrainian digest format.
- `src/analysis/article_analyzer.py`: Ukrainian deep-dive format.

## Extension Guidance

Prefer adding sources and keywords through YAML before changing code. Add a legal RSS/API source instead of scraping paywalled media. Keep scoring rule-based unless a future LLM step is explicitly requested; if LLM analysis is added, keep factual extraction separate from interpretation.
