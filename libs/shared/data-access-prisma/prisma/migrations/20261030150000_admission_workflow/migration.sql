ALTER TABLE "admission_applications"
  ADD COLUMN IF NOT EXISTS "info_requested_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "info_request_message" text,
  ADD COLUMN IF NOT EXISTS "offer_issued_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "offer_expires_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "fees_cleared_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "final_verified_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "enrollment_confirmed_at" timestamp(3);

CREATE TABLE IF NOT EXISTS "admission_application_events" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "application_id" text NOT NULL,
  "type" text NOT NULL,
  "from_status" text,
  "to_status" text,
  "message" text,
  "metadata" jsonb,
  "actor_user_id" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_admission_events_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_events_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_events_application_id" FOREIGN KEY ("application_id") REFERENCES "admission_applications"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_events_actor_user_id" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "admission_application_documents" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "application_id" text NOT NULL,
  "requirement_key" text NOT NULL,
  "label" text NOT NULL,
  "file_name" text,
  "mime_type" text,
  "storage_key" text,
  "file_size_bytes" bigint,
  "review_status" text NOT NULL DEFAULT 'PENDING',
  "review_note" text,
  "uploaded_at" timestamp(3),
  "reviewed_at" timestamp(3),
  "reviewed_by_id" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_admission_documents_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_documents_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_documents_application_id" FOREIGN KEY ("application_id") REFERENCES "admission_applications"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_admission_documents_reviewed_by_id" FOREIGN KEY ("reviewed_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_admission_application_documents_requirement" ON "admission_application_documents" ("application_id", "requirement_key");
CREATE INDEX IF NOT EXISTS "idx_admission_events_application_timeline" ON "admission_application_events" ("tenant_id", "application_id", "created_at");
CREATE INDEX IF NOT EXISTS "idx_admission_application_documents_review" ON "admission_application_documents" ("tenant_id", "school_id", "review_status");
