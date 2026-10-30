CREATE TABLE IF NOT EXISTS "student_document_records" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "student_id" text NOT NULL,
  "document_id" text,
  "key" text NOT NULL,
  "label" text NOT NULL,
  "is_required" boolean NOT NULL DEFAULT false,
  "status" text NOT NULL DEFAULT 'REQUIRED',
  "review_note" text,
  "expires_at" timestamp(3),
  "verified_at" timestamp(3),
  "verified_by_id" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_student_document_records_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_student_document_records_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_student_document_records_student_id" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_student_document_records_document_id" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_student_document_records_verified_by_id" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "student_medical_profiles" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "student_id" text NOT NULL,
  "allergies" text,
  "medical_conditions" text,
  "medications" text,
  "dietary_requirements" text,
  "physical_restrictions" text,
  "emergency_instructions" text,
  "emergency_contact_name" text,
  "emergency_contact_phone" text,
  "doctor_name" text,
  "doctor_phone" text,
  "consent_version" text,
  "parent_consented_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_student_medical_profiles_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_student_medical_profiles_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_student_medical_profiles_student_id" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_student_document_records_document_id" ON "student_document_records" ("document_id");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_student_document_records_student_key" ON "student_document_records" ("student_id", "key");
CREATE INDEX IF NOT EXISTS "idx_student_document_records_school_status" ON "student_document_records" ("tenant_id", "school_id", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_student_medical_profiles_student_id" ON "student_medical_profiles" ("student_id");
CREATE INDEX IF NOT EXISTS "idx_student_medical_profiles_school" ON "student_medical_profiles" ("tenant_id", "school_id");
