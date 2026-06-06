CREATE TABLE IF NOT EXISTS login_2fa_challenges (
  id TEXT PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMP(6) NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  consumed_at TIMESTAMP(6),
  ip_hash TEXT,
  created_at TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_2fa_challenges_member_id_idx
  ON login_2fa_challenges(member_id);

CREATE INDEX IF NOT EXISTS login_2fa_challenges_expires_at_idx
  ON login_2fa_challenges(expires_at);

CREATE TABLE IF NOT EXISTS login_rate_limits (
  key TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP(6),
  reset_at TIMESTAMP(6) NOT NULL,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS login_rate_limits_reset_at_idx
  ON login_rate_limits(reset_at);
