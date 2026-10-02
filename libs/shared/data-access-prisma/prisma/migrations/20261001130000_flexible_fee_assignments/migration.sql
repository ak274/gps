ALTER TABLE "fee_plans"
  ADD COLUMN IF NOT EXISTS "billing_cycle" text NOT NULL DEFAULT 'ANNUAL',
  ADD COLUMN IF NOT EXISTS "due_day" integer;

CREATE TABLE IF NOT EXISTS "classroom_fee_plans" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "class_room_id" text NOT NULL,
  "fee_plan_id" text NOT NULL,
  "assigned_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  "deleted_at" timestamp(3),
  "deleted_by_id" text,
  CONSTRAINT "fk_classroom_fee_plans_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_classroom_fee_plans_class_room_id" FOREIGN KEY ("class_room_id") REFERENCES "class_rooms"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_classroom_fee_plans_fee_plan_id" FOREIGN KEY ("fee_plan_id") REFERENCES "fee_plans"("id") ON DELETE RESTRICT,
  CONSTRAINT "fk_classroom_fee_plans_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_classroom_fee_plans_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_classroom_fee_plans_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "uq_classroom_fee_plans_classroom_fee_plan" ON "classroom_fee_plans" ("class_room_id", "fee_plan_id");
CREATE INDEX IF NOT EXISTS "idx_classroom_fee_plans_tenant_classroom" ON "classroom_fee_plans" ("tenant_id", "class_room_id");

CREATE TABLE IF NOT EXISTS "fee_adjustments" (
  "id" text PRIMARY KEY,
  "tenant_id" text NOT NULL,
  "school_id" text NOT NULL,
  "fee_plan_id" text,
  "class_room_id" text,
  "student_id" text,
  "code" text NOT NULL,
  "name" text NOT NULL,
  "amount" decimal(12,2) NOT NULL,
  "type" text NOT NULL,
  "billing_cycle" text NOT NULL DEFAULT 'ONE_TIME',
  "reason" text,
  "effective_from" date,
  "effective_to" date,
  "created_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by_id" text,
  "updated_by_id" text,
  "deleted_at" timestamp(3),
  "deleted_by_id" text,
  CONSTRAINT "fk_fee_adjustments_tenant_id" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_fee_adjustments_school_id" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_fee_adjustments_fee_plan_id" FOREIGN KEY ("fee_plan_id") REFERENCES "fee_plans"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_fee_adjustments_class_room_id" FOREIGN KEY ("class_room_id") REFERENCES "class_rooms"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_fee_adjustments_student_id" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_fee_adjustments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_fee_adjustments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL,
  CONSTRAINT "fk_fee_adjustments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_fee_adjustments_tenant_school_student" ON "fee_adjustments" ("tenant_id", "school_id", "student_id");
CREATE INDEX IF NOT EXISTS "idx_fee_adjustments_tenant_classroom" ON "fee_adjustments" ("tenant_id", "class_room_id");
