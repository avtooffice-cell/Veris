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
    content_hash TEXT,
    related_sources TEXT DEFAULT '[]'
);

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
