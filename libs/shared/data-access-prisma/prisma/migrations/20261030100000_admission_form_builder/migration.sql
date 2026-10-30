ALTER TABLE "admission_applications"
  ADD COLUMN IF NOT EXISTS "form_id" text,
  ADD COLUMN IF NOT EXISTS "form_version" integer,
  ADD COLUMN IF NOT EXISTS "application_number" text,
  ADD COLUMN IF NOT EXISTS "admission_category" text,
  ADD COLUMN IF NOT EXISTS "application_source" text,
  ADD COLUMN IF NOT EXISTS "preferred_language" text,
  ADD COLUMN IF NOT EXISTS "form_data" jsonb,
  ADD COLUMN IF NOT EXISTS "terms_version" text,
  ADD COLUMN IF NOT EXISTS "parent_acknowledged_at" timestamp(3);

CREATE TABLE IF NOT EXISTS "admission_forms" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "academic_year_id" text NOT NULL,
  "name" text NOT NULL,
  "version" integer NOT NULL DEFAULT 1,
  "status" text NOT NULL DEFAULT 'DRAFT',
  "description" text,
  "terms_text" text,
  "published_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_admission_forms_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_forms_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_forms_academic_year_id" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_admission_forms_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_admission_forms_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "admission_form_sections" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "form_id" text NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_admission_form_sections_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_form_sections_form_id" FOREIGN KEY ("form_id") REFERENCES "admission_forms"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_form_sections_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_admission_form_sections_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "admission_form_fields" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "section_id" text NOT NULL,
  "key" text NOT NULL,
  "label" text NOT NULL,
  "type" text NOT NULL,
  "help_text" text,
  "is_required" boolean NOT NULL DEFAULT false,
  "is_sensitive" boolean NOT NULL DEFAULT false,
  "sort_order" integer NOT NULL DEFAULT 0,
  "options" jsonb,
  "visibility" jsonb,
  "validation" jsonb,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_admission_form_fields_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_form_fields_section_id" FOREIGN KEY ("section_id") REFERENCES "admission_form_sections"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_form_fields_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_admission_form_fields_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "admission_document_requirements" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "form_id" text NOT NULL,
  "key" text NOT NULL,
  "label" text NOT NULL,
  "stage" text NOT NULL DEFAULT 'APPLICATION',
  "is_required" boolean NOT NULL DEFAULT false,
  "is_sensitive" boolean NOT NULL DEFAULT false,
  "accepted_types" jsonb,
  "max_size_mb" integer,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_admission_document_requirements_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_document_requirements_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_document_requirements_form_id" FOREIGN KEY ("form_id") REFERENCES "admission_forms"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_document_requirements_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_admission_document_requirements_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_admission_forms_school_year_version" ON "admission_forms" ("school_id", "academic_year_id", "version");
CREATE INDEX IF NOT EXISTS "idx_admission_forms_lookup" ON "admission_forms" ("tenant_id", "school_id", "academic_year_id", "status");
CREATE INDEX IF NOT EXISTS "idx_admission_form_sections_order" ON "admission_form_sections" ("tenant_id", "form_id", "sort_order");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_admission_form_fields_section_key" ON "admission_form_fields" ("section_id", "key");
CREATE INDEX IF NOT EXISTS "idx_admission_form_fields_order" ON "admission_form_fields" ("tenant_id", "section_id", "sort_order");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_admission_document_requirements_form_key" ON "admission_document_requirements" ("form_id", "key");
CREATE INDEX IF NOT EXISTS "idx_admission_document_requirements_lookup" ON "admission_document_requirements" ("tenant_id", "school_id", "form_id", "stage");
CREATE INDEX IF NOT EXISTS "idx_admission_applications_form_status" ON "admission_applications" ("tenant_id", "form_id", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_admission_applications_school_number" ON "admission_applications" ("school_id", "application_number");

DO $$ BEGIN
  ALTER TABLE "admission_applications" ADD CONSTRAINT "fk_admission_applications_form_id" FOREIGN KEY ("form_id") REFERENCES "admission_forms"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
