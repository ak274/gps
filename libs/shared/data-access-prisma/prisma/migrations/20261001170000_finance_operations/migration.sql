ALTER TABLE "invoices"
  ADD COLUMN IF NOT EXISTS "schedule_id" text,
  ADD COLUMN IF NOT EXISTS "period_start" date,
  ADD COLUMN IF NOT EXISTS "period_end" date;

CREATE TABLE IF NOT EXISTS "invoice_schedules" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "academic_year_id" text NOT NULL,
  "fee_plan_id" text NOT NULL,
  "name" text NOT NULL,
  "billing_cycle" text NOT NULL,
  "starts_on" date NOT NULL,
  "ends_on" date,
  "issue_day" integer NOT NULL DEFAULT 1,
  "due_day" integer NOT NULL DEFAULT 10,
  "auto_publish" boolean NOT NULL DEFAULT true,
  "auto_email" boolean NOT NULL DEFAULT false,
  "is_active" boolean NOT NULL DEFAULT true,
  "last_generated_at" timestamp(3),
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_invoice_schedules_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_invoice_schedules_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_invoice_schedules_academic_year_id" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_invoice_schedules_fee_plan_id" FOREIGN KEY ("fee_plan_id") REFERENCES "fee_plans"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_invoice_schedules_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_invoice_schedules_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "invoice_deliveries" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "invoice_id" text NOT NULL,
  "channel" text NOT NULL,
  "status" text NOT NULL DEFAULT 'QUEUED',
  "recipient" text,
  "queued_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sent_at" timestamp(3),
  "failure_reason" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_invoice_deliveries_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_invoice_deliveries_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_invoice_deliveries_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_invoice_deliveries_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_invoice_deliveries_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "payment_reminders" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "invoice_id" text NOT NULL,
  "channel" text NOT NULL,
  "scheduled_for" timestamp(3) NOT NULL,
  "status" text NOT NULL DEFAULT 'SCHEDULED',
  "sent_at" timestamp(3),
  "failure_reason" text,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  CONSTRAINT "fk_payment_reminders_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_payment_reminders_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_payment_reminders_invoice_id" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_payment_reminders_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_payment_reminders_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uq_invoice_schedules_school_plan_year" ON "invoice_schedules" ("school_id", "fee_plan_id", "academic_year_id");
CREATE INDEX IF NOT EXISTS "idx_invoice_schedules_tenant_school_active" ON "invoice_schedules" ("tenant_id", "school_id", "is_active");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_invoice_deliveries_invoice_channel" ON "invoice_deliveries" ("invoice_id", "channel");
CREATE INDEX IF NOT EXISTS "idx_invoice_deliveries_tenant_school_status" ON "invoice_deliveries" ("tenant_id", "school_id", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_payment_reminders_invoice_channel_date" ON "payment_reminders" ("invoice_id", "channel", "scheduled_for");
CREATE INDEX IF NOT EXISTS "idx_payment_reminders_due" ON "payment_reminders" ("tenant_id", "school_id", "status", "scheduled_for");
CREATE UNIQUE INDEX IF NOT EXISTS "uq_invoices_schedule_student_period" ON "invoices" ("schedule_id", "student_id", "period_start", "period_end");

DO $$ BEGIN
  ALTER TABLE "invoices" ADD CONSTRAINT "fk_invoices_schedule_id" FOREIGN KEY ("schedule_id") REFERENCES "invoice_schedules"("id") ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
