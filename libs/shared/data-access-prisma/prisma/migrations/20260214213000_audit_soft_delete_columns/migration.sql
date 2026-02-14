-- Add audit ownership + soft delete columns across major tables

ALTER TABLE "tenants"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_tenants_deleted_at" ON "tenants"("deleted_at");

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_users_deleted_at" ON "users"("deleted_at");

ALTER TABLE "user_tenants"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_user_tenants_deleted_at" ON "user_tenants"("deleted_at");

ALTER TABLE "roles"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_roles_deleted_at" ON "roles"("deleted_at");

ALTER TABLE "permissions"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_permissions_deleted_at" ON "permissions"("deleted_at");

ALTER TABLE "role_permissions"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_role_permissions_deleted_at" ON "role_permissions"("deleted_at");

ALTER TABLE "user_role_assignments"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_user_role_assignments_deleted_at" ON "user_role_assignments"("deleted_at");

ALTER TABLE "schools"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_schools_deleted_at" ON "schools"("deleted_at");

ALTER TABLE "campuses"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_campuses_deleted_at" ON "campuses"("deleted_at");

ALTER TABLE "academic_years"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_academic_years_deleted_at" ON "academic_years"("deleted_at");

ALTER TABLE "terms"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_terms_deleted_at" ON "terms"("deleted_at");

ALTER TABLE "staff_profiles"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_staff_profiles_deleted_at" ON "staff_profiles"("deleted_at");

ALTER TABLE "teacher_profiles"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_teacher_profiles_deleted_at" ON "teacher_profiles"("deleted_at");

ALTER TABLE "guardians"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_guardians_deleted_at" ON "guardians"("deleted_at");

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_students_deleted_at" ON "students"("deleted_at");

ALTER TABLE "student_guardians"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_student_guardians_deleted_at" ON "student_guardians"("deleted_at");

ALTER TABLE "class_rooms"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_class_rooms_deleted_at" ON "class_rooms"("deleted_at");

ALTER TABLE "subjects"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_subjects_deleted_at" ON "subjects"("deleted_at");

ALTER TABLE "classroom_subjects"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_classroom_subjects_deleted_at" ON "classroom_subjects"("deleted_at");

ALTER TABLE "enrollments"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_enrollments_deleted_at" ON "enrollments"("deleted_at");

ALTER TABLE "attendance_sessions"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_attendance_sessions_deleted_at" ON "attendance_sessions"("deleted_at");

ALTER TABLE "attendance_records"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_attendance_records_deleted_at" ON "attendance_records"("deleted_at");

ALTER TABLE "fee_plans"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_fee_plans_deleted_at" ON "fee_plans"("deleted_at");

ALTER TABLE "fee_items"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_fee_items_deleted_at" ON "fee_items"("deleted_at");

ALTER TABLE "student_fee_plans"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_student_fee_plans_deleted_at" ON "student_fee_plans"("deleted_at");

ALTER TABLE "invoices"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_invoices_deleted_at" ON "invoices"("deleted_at");

ALTER TABLE "invoice_lines"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_invoice_lines_deleted_at" ON "invoice_lines"("deleted_at");

ALTER TABLE "payments"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_payments_deleted_at" ON "payments"("deleted_at");

ALTER TABLE "payment_allocations"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_payment_allocations_deleted_at" ON "payment_allocations"("deleted_at");

ALTER TABLE "transport_vehicles"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_transport_vehicles_deleted_at" ON "transport_vehicles"("deleted_at");

ALTER TABLE "transport_routes"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_transport_routes_deleted_at" ON "transport_routes"("deleted_at");

ALTER TABLE "transport_stops"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_transport_stops_deleted_at" ON "transport_stops"("deleted_at");

ALTER TABLE "student_transport_assignments"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_student_transport_assignments_deleted_at" ON "student_transport_assignments"("deleted_at");

ALTER TABLE "documents"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_documents_deleted_at" ON "documents"("deleted_at");

ALTER TABLE "timetable_entries"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_timetable_entries_deleted_at" ON "timetable_entries"("deleted_at");

ALTER TABLE "teacher_attendance"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_teacher_attendance_deleted_at" ON "teacher_attendance"("deleted_at");

ALTER TABLE "notifications"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_notifications_deleted_at" ON "notifications"("deleted_at");

ALTER TABLE "user_notifications"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_user_notifications_deleted_at" ON "user_notifications"("deleted_at");

ALTER TABLE "messages"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_messages_deleted_at" ON "messages"("deleted_at");

ALTER TABLE "sessions"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_sessions_deleted_at" ON "sessions"("deleted_at");

ALTER TABLE "audit_logs"
  ADD COLUMN IF NOT EXISTS "created_by_id" text,
  ADD COLUMN IF NOT EXISTS "updated_by_id" text,
  ADD COLUMN IF NOT EXISTS "deleted_at" timestamp(3),
  ADD COLUMN IF NOT EXISTS "deleted_by_id" text;

CREATE INDEX IF NOT EXISTS "idx_audit_logs_deleted_at" ON "audit_logs"("deleted_at");
