-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "HomeworkStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- DropForeignKey
ALTER TABLE "public"."academic_years" DROP CONSTRAINT "fk_academic_years_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."academic_years" DROP CONSTRAINT "fk_academic_years_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."academic_years" DROP CONSTRAINT "fk_academic_years_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."attendance_records" DROP CONSTRAINT "fk_attendance_records_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."attendance_records" DROP CONSTRAINT "fk_attendance_records_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."attendance_records" DROP CONSTRAINT "fk_attendance_records_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."attendance_sessions" DROP CONSTRAINT "fk_attendance_sessions_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."attendance_sessions" DROP CONSTRAINT "fk_attendance_sessions_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."attendance_sessions" DROP CONSTRAINT "fk_attendance_sessions_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."audit_logs" DROP CONSTRAINT "fk_audit_logs_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."audit_logs" DROP CONSTRAINT "fk_audit_logs_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."audit_logs" DROP CONSTRAINT "fk_audit_logs_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."campuses" DROP CONSTRAINT "fk_campuses_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."campuses" DROP CONSTRAINT "fk_campuses_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."campuses" DROP CONSTRAINT "fk_campuses_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."class_rooms" DROP CONSTRAINT "fk_class_rooms_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."class_rooms" DROP CONSTRAINT "fk_class_rooms_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."class_rooms" DROP CONSTRAINT "fk_class_rooms_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."classroom_subjects" DROP CONSTRAINT "fk_classroom_subjects_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."classroom_subjects" DROP CONSTRAINT "fk_classroom_subjects_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."classroom_subjects" DROP CONSTRAINT "fk_classroom_subjects_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "fk_documents_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "fk_documents_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "fk_documents_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "fk_enrollments_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "fk_enrollments_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "fk_enrollments_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."fee_items" DROP CONSTRAINT "fk_fee_items_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."fee_items" DROP CONSTRAINT "fk_fee_items_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."fee_items" DROP CONSTRAINT "fk_fee_items_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."fee_plans" DROP CONSTRAINT "fk_fee_plans_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."fee_plans" DROP CONSTRAINT "fk_fee_plans_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."fee_plans" DROP CONSTRAINT "fk_fee_plans_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."guardians" DROP CONSTRAINT "fk_guardians_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."guardians" DROP CONSTRAINT "fk_guardians_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."guardians" DROP CONSTRAINT "fk_guardians_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."invoice_lines" DROP CONSTRAINT "fk_invoice_lines_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."invoice_lines" DROP CONSTRAINT "fk_invoice_lines_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."invoice_lines" DROP CONSTRAINT "fk_invoice_lines_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "fk_invoices_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "fk_invoices_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."invoices" DROP CONSTRAINT "fk_invoices_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "fk_messages_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "fk_messages_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."messages" DROP CONSTRAINT "fk_messages_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "fk_notifications_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "fk_notifications_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "fk_notifications_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."payment_allocations" DROP CONSTRAINT "fk_payment_allocations_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."payment_allocations" DROP CONSTRAINT "fk_payment_allocations_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."payment_allocations" DROP CONSTRAINT "fk_payment_allocations_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "fk_payments_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "fk_payments_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "fk_payments_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."permissions" DROP CONSTRAINT "fk_permissions_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."permissions" DROP CONSTRAINT "fk_permissions_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."permissions" DROP CONSTRAINT "fk_permissions_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."role_permissions" DROP CONSTRAINT "fk_role_permissions_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."role_permissions" DROP CONSTRAINT "fk_role_permissions_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."role_permissions" DROP CONSTRAINT "fk_role_permissions_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "fk_roles_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "fk_roles_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."roles" DROP CONSTRAINT "fk_roles_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "fk_schools_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "fk_schools_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."schools" DROP CONSTRAINT "fk_schools_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "fk_sessions_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "fk_sessions_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "fk_sessions_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."staff_profiles" DROP CONSTRAINT "fk_staff_profiles_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."staff_profiles" DROP CONSTRAINT "fk_staff_profiles_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."staff_profiles" DROP CONSTRAINT "fk_staff_profiles_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_fee_plans" DROP CONSTRAINT "fk_student_fee_plans_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_fee_plans" DROP CONSTRAINT "fk_student_fee_plans_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_fee_plans" DROP CONSTRAINT "fk_student_fee_plans_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_guardians" DROP CONSTRAINT "fk_student_guardians_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_guardians" DROP CONSTRAINT "fk_student_guardians_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_guardians" DROP CONSTRAINT "fk_student_guardians_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_transport_assignments" DROP CONSTRAINT "fk_student_transport_assignments_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_transport_assignments" DROP CONSTRAINT "fk_student_transport_assignments_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."student_transport_assignments" DROP CONSTRAINT "fk_student_transport_assignments_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "fk_students_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "fk_students_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."students" DROP CONSTRAINT "fk_students_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."subjects" DROP CONSTRAINT "fk_subjects_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."subjects" DROP CONSTRAINT "fk_subjects_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."subjects" DROP CONSTRAINT "fk_subjects_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."teacher_attendance" DROP CONSTRAINT "fk_teacher_attendance_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."teacher_attendance" DROP CONSTRAINT "fk_teacher_attendance_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."teacher_attendance" DROP CONSTRAINT "fk_teacher_attendance_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."teacher_profiles" DROP CONSTRAINT "fk_teacher_profiles_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."teacher_profiles" DROP CONSTRAINT "fk_teacher_profiles_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."teacher_profiles" DROP CONSTRAINT "fk_teacher_profiles_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."tenants" DROP CONSTRAINT "fk_tenants_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."tenants" DROP CONSTRAINT "fk_tenants_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."tenants" DROP CONSTRAINT "fk_tenants_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."terms" DROP CONSTRAINT "fk_terms_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."terms" DROP CONSTRAINT "fk_terms_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."terms" DROP CONSTRAINT "fk_terms_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."timetable_entries" DROP CONSTRAINT "fk_timetable_entries_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."timetable_entries" DROP CONSTRAINT "fk_timetable_entries_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."timetable_entries" DROP CONSTRAINT "fk_timetable_entries_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_routes" DROP CONSTRAINT "fk_transport_routes_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_routes" DROP CONSTRAINT "fk_transport_routes_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_routes" DROP CONSTRAINT "fk_transport_routes_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_stops" DROP CONSTRAINT "fk_transport_stops_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_stops" DROP CONSTRAINT "fk_transport_stops_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_stops" DROP CONSTRAINT "fk_transport_stops_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_vehicles" DROP CONSTRAINT "fk_transport_vehicles_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_vehicles" DROP CONSTRAINT "fk_transport_vehicles_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."transport_vehicles" DROP CONSTRAINT "fk_transport_vehicles_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_notifications" DROP CONSTRAINT "fk_user_notifications_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_notifications" DROP CONSTRAINT "fk_user_notifications_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_notifications" DROP CONSTRAINT "fk_user_notifications_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_role_assignments" DROP CONSTRAINT "fk_user_role_assignments_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_role_assignments" DROP CONSTRAINT "fk_user_role_assignments_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_role_assignments" DROP CONSTRAINT "fk_user_role_assignments_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_tenants" DROP CONSTRAINT "fk_user_tenants_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_tenants" DROP CONSTRAINT "fk_user_tenants_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."user_tenants" DROP CONSTRAINT "fk_user_tenants_updated_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "fk_users_created_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "fk_users_deleted_by_id_users";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "fk_users_updated_by_id_users";

-- DropIndex
DROP INDEX "public"."idx_academic_years_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_attendance_records_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_attendance_sessions_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_audit_logs_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_campuses_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_class_rooms_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_classroom_subjects_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_documents_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_enrollments_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_fee_items_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_fee_plans_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_guardians_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_invoice_lines_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_invoices_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_messages_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_notifications_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_payment_allocations_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_payments_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_permissions_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_role_permissions_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_roles_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_schools_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_sessions_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_staff_profiles_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_student_fee_plans_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_student_guardians_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_student_transport_assignments_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_students_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_subjects_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_teacher_attendance_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_teacher_profiles_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_tenants_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_terms_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_timetable_entries_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_transport_routes_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_transport_stops_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_transport_vehicles_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_user_notifications_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_user_role_assignments_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_user_tenants_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_users_deleted_at";

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "term_id" TEXT,
    "class_room_id" TEXT NOT NULL,
    "teacher_id" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exam_type" TEXT NOT NULL,
    "starts_on" DATE NOT NULL,
    "ends_on" DATE,
    "status" "ExamStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_subjects" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "max_marks" DECIMAL(10,2) NOT NULL,
    "pass_marks" DECIMAL(10,2),
    "weightage" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "exam_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_assessments" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "exam_subject_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "marks_obtained" DECIMAL(10,2),
    "grade" TEXT,
    "remarks" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "student_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homework" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "school_id" TEXT NOT NULL,
    "class_room_id" TEXT NOT NULL,
    "subject_id" TEXT,
    "teacher_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assigned_on" DATE NOT NULL,
    "due_on" DATE,
    "status" "HomeworkStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by_id" TEXT,

    CONSTRAINT "homework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_exams_tenant_school_classroom" ON "exams"("tenant_id", "school_id", "class_room_id");

-- CreateIndex
CREATE INDEX "idx_exams_year_term" ON "exams"("academic_year_id", "term_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_exams_school_code" ON "exams"("school_id", "code");

-- CreateIndex
CREATE INDEX "idx_exam_subjects_tenant_subject" ON "exam_subjects"("tenant_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_exam_subjects_exam_subject" ON "exam_subjects"("exam_id", "subject_id");

-- CreateIndex
CREATE INDEX "idx_student_assessments_tenant_exam_student" ON "student_assessments"("tenant_id", "exam_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_student_assessments_exam_subject_student" ON "student_assessments"("exam_subject_id", "student_id");

-- CreateIndex
CREATE INDEX "idx_homework_tenant_school_classroom" ON "homework"("tenant_id", "school_id", "class_room_id");

-- CreateIndex
CREATE INDEX "idx_homework_subject_assigned_on" ON "homework"("subject_id", "assigned_on");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "fk_tenants_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "fk_tenants_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "fk_tenants_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "fk_users_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "fk_user_tenants_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "fk_user_tenants_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tenants" ADD CONSTRAINT "fk_user_tenants_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "fk_roles_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "fk_permissions_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "fk_permissions_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "fk_permissions_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_role_permissions_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_role_permissions_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_role_permissions_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_assignments" ADD CONSTRAINT "fk_user_role_assignments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_assignments" ADD CONSTRAINT "fk_user_role_assignments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_role_assignments" ADD CONSTRAINT "fk_user_role_assignments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "fk_schools_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "fk_schools_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schools" ADD CONSTRAINT "fk_schools_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campuses" ADD CONSTRAINT "fk_campuses_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campuses" ADD CONSTRAINT "fk_campuses_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campuses" ADD CONSTRAINT "fk_campuses_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "fk_academic_years_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "fk_academic_years_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_years" ADD CONSTRAINT "fk_academic_years_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "fk_terms_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "fk_terms_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "terms" ADD CONSTRAINT "fk_terms_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "fk_staff_profiles_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "fk_staff_profiles_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_profiles" ADD CONSTRAINT "fk_staff_profiles_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "fk_teacher_profiles_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "fk_teacher_profiles_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_profiles" ADD CONSTRAINT "fk_teacher_profiles_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "fk_guardians_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "fk_guardians_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guardians" ADD CONSTRAINT "fk_guardians_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "fk_students_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "fk_students_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "fk_students_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "fk_student_guardians_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "fk_student_guardians_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_guardians" ADD CONSTRAINT "fk_student_guardians_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rooms" ADD CONSTRAINT "fk_class_rooms_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rooms" ADD CONSTRAINT "fk_class_rooms_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rooms" ADD CONSTRAINT "fk_class_rooms_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "fk_subjects_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "fk_subjects_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "fk_subjects_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_subjects" ADD CONSTRAINT "fk_classroom_subjects_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_subjects" ADD CONSTRAINT "fk_classroom_subjects_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classroom_subjects" ADD CONSTRAINT "fk_classroom_subjects_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "fk_enrollments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "fk_enrollments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollments" ADD CONSTRAINT "fk_enrollments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "fk_attendance_sessions_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "fk_attendance_sessions_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_sessions" ADD CONSTRAINT "fk_attendance_sessions_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "fk_attendance_records_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "fk_attendance_records_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "fk_attendance_records_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_plans" ADD CONSTRAINT "fk_fee_plans_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_plans" ADD CONSTRAINT "fk_fee_plans_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_plans" ADD CONSTRAINT "fk_fee_plans_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_items" ADD CONSTRAINT "fk_fee_items_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_items" ADD CONSTRAINT "fk_fee_items_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_items" ADD CONSTRAINT "fk_fee_items_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_plans" ADD CONSTRAINT "fk_student_fee_plans_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_plans" ADD CONSTRAINT "fk_student_fee_plans_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_plans" ADD CONSTRAINT "fk_student_fee_plans_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "fk_invoices_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "fk_invoices_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "fk_invoices_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "fk_invoice_lines_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "fk_invoice_lines_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_lines" ADD CONSTRAINT "fk_invoice_lines_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "fk_payments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "fk_payments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "fk_payments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "fk_payment_allocations_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "fk_payment_allocations_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_allocations" ADD CONSTRAINT "fk_payment_allocations_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_vehicles" ADD CONSTRAINT "fk_transport_vehicles_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_vehicles" ADD CONSTRAINT "fk_transport_vehicles_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_vehicles" ADD CONSTRAINT "fk_transport_vehicles_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_routes" ADD CONSTRAINT "fk_transport_routes_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_routes" ADD CONSTRAINT "fk_transport_routes_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_routes" ADD CONSTRAINT "fk_transport_routes_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_stops" ADD CONSTRAINT "fk_transport_stops_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_stops" ADD CONSTRAINT "fk_transport_stops_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_stops" ADD CONSTRAINT "fk_transport_stops_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "fk_student_transport_assignments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "fk_student_transport_assignments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_transport_assignments" ADD CONSTRAINT "fk_student_transport_assignments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "fk_documents_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "fk_documents_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "fk_documents_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "fk_timetable_entries_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "fk_timetable_entries_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timetable_entries" ADD CONSTRAINT "fk_timetable_entries_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_class_room_id_fkey" FOREIGN KEY ("class_room_id") REFERENCES "class_rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "fk_exams_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "fk_exams_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "fk_exams_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "exam_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "fk_exam_subjects_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "fk_exam_subjects_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_subjects" ADD CONSTRAINT "fk_exam_subjects_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "student_assessments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "student_assessments_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "student_assessments_exam_subject_id_fkey" FOREIGN KEY ("exam_subject_id") REFERENCES "exam_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "student_assessments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "fk_student_assessments_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "fk_student_assessments_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_assessments" ADD CONSTRAINT "fk_student_assessments_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_class_room_id_fkey" FOREIGN KEY ("class_room_id") REFERENCES "class_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "homework_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "fk_homework_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "fk_homework_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homework" ADD CONSTRAINT "fk_homework_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_attendance" ADD CONSTRAINT "fk_teacher_attendance_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_attendance" ADD CONSTRAINT "fk_teacher_attendance_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher_attendance" ADD CONSTRAINT "fk_teacher_attendance_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "fk_user_notifications_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "fk_user_notifications_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "fk_user_notifications_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "fk_messages_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "fk_sessions_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "fk_audit_logs_created_by_id_users" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "fk_audit_logs_updated_by_id_users" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "fk_audit_logs_deleted_by_id_users" FOREIGN KEY ("deleted_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
