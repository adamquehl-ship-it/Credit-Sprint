-- Credit Sprint accounts database (Cloudflare D1).
-- Create it once: Cloudflare dashboard → Storage & Databases → D1 → Create database "creditsprint",
-- then open the database → Console, paste this whole file and run it.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  google_sub TEXT UNIQUE,
  pass_hash TEXT,
  display_name TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS email_codes (
  email TEXT PRIMARY KEY,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  sent_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS league_members (
  week TEXT NOT NULL,
  user_id TEXT NOT NULL,
  tier INTEGER NOT NULL,
  group_id INTEGER NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (week, user_id)
);
CREATE INDEX IF NOT EXISTS league_group ON league_members(week, tier, group_id);
CREATE TABLE IF NOT EXISTS league_tiers (
  user_id TEXT PRIMARY KEY,
  tier INTEGER NOT NULL DEFAULT 0,
  last_week TEXT
);
-- profile pictures (also created automatically by the site the first time they're used)
CREATE TABLE IF NOT EXISTS avatars (user_id TEXT PRIMARY KEY, data TEXT NOT NULL, v INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS avatar_reports (user_id TEXT NOT NULL, reporter_id TEXT NOT NULL, created_at INTEGER NOT NULL, PRIMARY KEY (user_id, reporter_id));
