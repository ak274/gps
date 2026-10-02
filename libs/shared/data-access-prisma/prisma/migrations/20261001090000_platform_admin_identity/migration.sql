ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "is_platform_admin" boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS "idx_users_is_platform_admin"
  ON "users" ("is_platform_admin");
