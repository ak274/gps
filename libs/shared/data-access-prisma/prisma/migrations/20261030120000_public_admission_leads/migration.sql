CREATE TABLE IF NOT EXISTS "admission_leads" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "form_id" text NOT NULL,
  "email" text NOT NULL,
  "phone" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text,
  "status" text NOT NULL DEFAULT 'STARTED',
  "verification_code_hash" text NOT NULL,
  "verification_expires_at" timestamp(3) NOT NULL,
  "verified_at" timestamp(3),
  "resume_token_hash" text NOT NULL,
  "draft_data" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "current_section" integer NOT NULL DEFAULT 0,
  "last_saved_at" timestamp(3),
  "submitted_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_admission_leads_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_leads_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_leads_form_id" FOREIGN KEY ("form_id") REFERENCES "admission_forms"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_admission_leads_resume_token_hash" ON "admission_leads" ("resume_token_hash");
CREATE INDEX IF NOT EXISTS "idx_admission_leads_school_status" ON "admission_leads" ("school_id", "status");
CREATE INDEX IF NOT EXISTS "idx_admission_leads_email_school" ON "admission_leads" ("email", "school_id");
