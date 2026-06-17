-- ============================================================
-- Wellforward — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. Users / Profiles ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  programme       TEXT NOT NULL,
  school          TEXT NOT NULL DEFAULT 'Smurfit Business School',
  intake_year     TEXT NOT NULL,
  hometown        TEXT,
  bio             TEXT,
  interests       TEXT,          -- comma-separated tags
  looking_for     TEXT,          -- comma-separated values
  photo_url       TEXT,          -- Supabase Storage public URL
  linkedin        TEXT,          -- LinkedIn profile URL
  instagram       TEXT,          -- Instagram handle or URL
  contact_email   TEXT,          -- public contact email (optional, separate from login email)
  role            TEXT NOT NULL DEFAULT 'student',
                                 -- 'student' (meet-people) | 'senior' (ask-a-senior)
  verified        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add new columns if table already exists (safe to re-run)
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin      TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS instagram     TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Index for fast lookups by role (powers /api/students and /api/seniors)
CREATE INDEX IF NOT EXISTS users_role_idx  ON users (role);
CREATE INDEX IF NOT EXISTS users_email_idx ON users (email);

-- ── 2. OTP codes ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otps (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT NOT NULL,
  code        TEXT NOT NULL,            -- 6-digit string
  expires_at  TIMESTAMPTZ NOT NULL,     -- 10 minutes from creation
  used        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS otps_email_idx ON otps (email);

-- ── 3. Storage bucket ────────────────────────────────────────
-- Create this manually in Supabase Dashboard:
--   Storage → New bucket → Name: "Avatars" → Public: YES

-- ── 4. Row Level Security ────────────────────────────────────
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE otps  DISABLE ROW LEVEL SECURITY;
