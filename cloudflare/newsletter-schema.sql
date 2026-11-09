-- Apply to the D1 database bound as DB before enabling newsletter signup.
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  status TEXT NOT NULL CHECK(status IN ('subscribed', 'unsubscribed')),
  consent_at TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  subscribed_at TEXT NOT NULL,
  unsubscribed_at TEXT,
  source TEXT NOT NULL,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_newsletter_status_created ON newsletter_subscribers(status, created_at DESC);
