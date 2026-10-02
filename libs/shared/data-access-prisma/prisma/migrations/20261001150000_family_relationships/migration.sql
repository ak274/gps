CREATE TABLE IF NOT EXISTS "families" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "display_name" text NOT NULL,
  "notes" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  "deleted_at" timestamp(3),
  "deleted_by_id" text,
  CONSTRAINT "fk_families_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_families_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_families_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_families_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_families_tenant_name" ON "families" ("tenant_id", "display_name");

CREATE TABLE IF NOT EXISTS "family_students" (
  "id" text PRIMARY KEY,
  "family_id" text NOT NULL,
  "student_id" text NOT NULL,
  "relationship_label" text,
  CONSTRAINT "fk_family_students_family_id" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_family_students_student_id" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "uq_family_students_family_student" ON "family_students" ("family_id", "student_id");
CREATE INDEX IF NOT EXISTS "idx_family_students_student" ON "family_students" ("student_id");

CREATE TABLE IF NOT EXISTS "family_guardians" (
  "id" text PRIMARY KEY,
  "family_id" text NOT NULL,
  "guardian_id" text NOT NULL,
  "relationship_label" text,
  CONSTRAINT "fk_family_guardians_family_id" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_family_guardians_guardian_id" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "uq_family_guardians_family_guardian" ON "family_guardians" ("family_id", "guardian_id");

CREATE TABLE IF NOT EXISTS "family_alumni" (
  "id" text PRIMARY KEY,
  "family_id" text NOT NULL,
  "school_id" text NOT NULL,
  "name" text NOT NULL,
  "relationship_label" text,
  "admission_no" text,
  "graduation_year" text,
  "notes" text,
  CONSTRAINT "fk_family_alumni_family_id" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_family_alumni_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS "idx_family_alumni_family" ON "family_alumni" ("family_id");

CREATE TABLE IF NOT EXISTS "family_benefits" (
  "id" text PRIMARY KEY,
  "family_id" text NOT NULL,
  "school_id" text NOT NULL,
  "fee_plan_id" text,
  "type" text NOT NULL,
  "value" decimal(12,2) NOT NULL,
  "minimum_student_count" integer NOT NULL DEFAULT 2,
  "reason" text NOT NULL,
  "is_active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_family_benefits_family_id" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_family_benefits_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_family_benefits_fee_plan_id" FOREIGN KEY ("fee_plan_id") REFERENCES "fee_plans"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_family_benefits_family_school_active" ON "family_benefits" ("family_id", "school_id", "is_active");
