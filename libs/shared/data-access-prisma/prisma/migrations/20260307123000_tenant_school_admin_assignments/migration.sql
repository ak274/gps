CREATE TABLE IF NOT EXISTS "user_tenant_school_assignments" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "user_tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "can_manage_all_campuses" boolean NOT NULL DEFAULT true,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  "deleted_at" timestamp(3),
  "deleted_by_id" text,
  CONSTRAINT "fk_user_tenant_school_assignments_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_user_tenant_school_assignments_user_tenant_id" FOREIGN KEY ("user_tenant_id") REFERENCES "user_tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_user_tenant_school_assignments_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_user_tenant_school_assignments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_user_tenant_school_assignments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_user_tenant_school_assignments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_user_tenant_school_assignments_user_tenant_school"
  ON "user_tenant_school_assignments" ("user_tenant_id", "school_id");

CREATE INDEX IF NOT EXISTS "idx_user_tenant_school_assignments_tenant_school"
  ON "user_tenant_school_assignments" ("tenant_id", "school_id");

CREATE INDEX IF NOT EXISTS "idx_user_tenant_school_assignments_tenant_user_tenant"
  ON "user_tenant_school_assignments" ("tenant_id", "user_tenant_id");

CREATE INDEX IF NOT EXISTS "idx_user_tenant_school_assignments_deleted_at"
  ON "user_tenant_school_assignments" ("deleted_at");
