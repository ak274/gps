# Data Access Prisma

Prisma schema and migration workspace for the school SaaS backend.

## Location

- Schema: `libs/shared/data-access-prisma/prisma/schema.prisma`
- Migrations: `libs/shared/data-access-prisma/prisma/migrations`
- Local env (for Prisma CLI in this cwd): `libs/shared/data-access-prisma/.env`
- Required env var: `DATABASE_URL`

## Conventions Used

- Prisma model names are `PascalCase`, fields are `camelCase`.
- PostgreSQL tables/columns are mapped to `snake_case` via `@@map` and `@map`.
- Multi-tenant isolation is enforced with `tenant_id` on domain tables.
- Business aggregates also include `school_id` where school-level scoping is needed.
- All relation fields are explicit and backed by FK constraints.

## Nx Targets

- `nx run @gps/data-access-prisma:format`
- `nx run @gps/data-access-prisma:generate`
- `nx run @gps/data-access-prisma:migrate-dev -- --name <migration_name>`
- `nx run @gps/data-access-prisma:migrate-deploy`
- `nx run @gps/data-access-prisma:db-push`
- `nx run @gps/data-access-prisma:studio`

## Schema Overview

### 1) Tenancy, Identity, and Access Control

- `tenants`
  - Objective: top-level tenant partition.
  - Core relations: `schools`, `roles`, `users (via user_tenants)`, all domain tables.
  - Key constraints/indexes: `uq_tenants_code`.

- `users`
  - Objective: global identity/auth account.
  - Core relations: `user_tenants`, `staff_profiles`, `guardians`, `sessions`, `notifications`, `messages`, `audit_logs`.
  - Key constraints/indexes: `uq_users_email`, `uq_users_phone_e164`, `idx_users_status`.

- `user_tenants`
  - Objective: membership of a user in a tenant.
  - FK: `tenant_id -> tenants.id`, `user_id -> users.id`.
  - Key constraints/indexes: `uq_user_tenants_tenant_user`, `idx_user_tenants_user_id`, `idx_user_tenants_tenant_status`.

- `roles`, `permissions`, `role_permissions`, `user_role_assignments`
  - Objective: tenant-scoped RBAC.
  - FK chain: `roles -> tenants`, `role_permissions -> roles/permissions`, `user_role_assignments -> user_tenants/roles`.
  - Key constraints/indexes:
    - `uq_roles_tenant_key`
    - `uq_permissions_key`
    - `uq_role_permissions_role_permission`
    - `uq_user_role_assignments_user_tenant_role`

- `sessions`
  - Objective: login/session persistence.
  - FK: `tenant_id -> tenants.id`, `user_id -> users.id`.
  - Key constraints/indexes: `uq_sessions_token`, `idx_sessions_user_expires_at`, `idx_sessions_tenant_user`.

### 2) School, Campus, and Academic Structure

- `schools`, `campuses`
  - Objective: school hierarchy inside a tenant.
  - FK: `schools.tenant_id -> tenants.id`, `campuses.school_id -> schools.id`.
  - Key constraints/indexes:
    - `uq_schools_tenant_code`
    - `uq_campuses_school_code`
    - tenant lookup indexes for both tables.

- `academic_years`, `terms`
  - Objective: academic periods and term segmentation.
  - FK: `academic_years -> tenants/schools`, `terms -> tenants/schools/academic_years`.
  - Key constraints/indexes:
    - `uq_academic_years_school_name`
    - `uq_terms_academic_year_name`
    - `idx_academic_years_current`.

- `class_rooms`, `subjects`, `classroom_subjects`, `enrollments`
  - Objective: class-section setup, subject mapping, teacher assignment, student enrollment.
  - FK highlights:
    - `class_rooms -> academic_years/schools/campuses/teacher_profiles`
    - `classroom_subjects -> class_rooms/subjects/teacher_profiles`
    - `enrollments -> students/class_rooms/academic_years`.
  - Key constraints/indexes:
    - `uq_class_rooms_academic_year_name`
    - `uq_subjects_school_code`
    - `uq_classroom_subjects_class_room_subject`
    - `uq_enrollments_student_academic_year`
    - class and enrollment lookup indexes.

- `timetable_entries`
  - Objective: weekly class timetable slots.
  - FK: `tenant_id`, `school_id`, `class_room_id`, `subject_id`, optional `teacher_id`.
  - Key constraints/indexes:
    - `uq_timetable_entries_class_day_start` (prevent slot overlap per class/day/start)
    - teacher/day and tenant/school lookup indexes.

### 3) People Domain

- `staff_profiles`, `teacher_profiles`
  - Objective: staff records and teacher-specific metadata.
  - FK: `staff_profiles -> users/schools/campuses/tenants`; `teacher_profiles -> staff_profiles/tenants`.
  - Key constraints/indexes:
    - `uq_staff_profiles_tenant_employee_code`
    - `uq_staff_profiles_school_user`
    - `uq_teacher_profiles_staff_profile_id`.

- `students`, `guardians`, `student_guardians`
  - Objective: student records and guardian relationships (many-to-many).
  - FK:
    - `students -> schools/campuses/tenants`
    - `guardians -> schools/users/tenants`
    - `student_guardians -> students/guardians/tenants`.
  - Key constraints/indexes:
    - `uq_students_school_admission_no`
    - `uq_guardians_school_user`
    - `uq_student_guardians_student_guardian`.

### 4) Attendance

- `attendance_sessions`, `attendance_records`
  - Objective: class-level attendance session and per-student attendance status.
  - FK:
    - `attendance_sessions -> class_rooms/subjects/staff_profiles/tenants`
    - `attendance_records -> attendance_sessions/students/tenants`.
  - Key constraints/indexes:
    - `uq_attendance_records_session_student`
    - student/session/date lookup indexes.

- `teacher_attendance`
  - Objective: teacher daily attendance.
  - FK: `teacher_id -> teacher_profiles.id`, plus tenant/school FKs.
  - Key constraints/indexes:
    - `uq_teacher_attendance_teacher_date`
    - `idx_teacher_attendance_tenant_school_date`.

### 5) Fees and Billing

- `fee_plans`, `fee_items`, `student_fee_plans`
  - Objective: fee structures and assignment of fee plans to students.
  - FK:
    - `fee_plans -> schools/academic_years/tenants`
    - `fee_items -> fee_plans/tenants`
    - `student_fee_plans -> students/fee_plans/tenants`.
  - Key constraints/indexes:
    - `uq_fee_plans_school_year_name`
    - `uq_fee_items_fee_plan_code`
    - `uq_student_fee_plans_student_fee_plan`.

- `invoices`, `invoice_lines`, `payments`, `payment_allocations`
  - Objective: invoicing and payment settlement.
  - FK:
    - `invoices -> students/schools/tenants`
    - `invoice_lines -> invoices/fee_items/tenants`
    - `payments -> students/schools/tenants`
    - `payment_allocations -> payments/invoices/tenants`.
  - Key constraints/indexes:
    - `uq_invoices_school_invoice_number`
    - `uq_payments_school_receipt_number`
    - `uq_payment_allocations_payment_invoice`
    - status/date lookup indexes.

### 6) Transport

- `transport_vehicles`
  - Objective: bus/vehicle inventory.
  - FK: `school_id`, `tenant_id`.
  - Key constraints/indexes: `uq_transport_vehicles_school_vehicle_number`.

- `transport_routes`, `transport_stops`
  - Objective: route and ordered stops.
  - FK:
    - `transport_routes -> schools/tenants`, optional vehicle assignment
    - `transport_stops -> routes/tenants`.
  - Key constraints/indexes:
    - `uq_transport_routes_school_code`
    - `uq_transport_stops_route_sequence`.

- `student_transport_assignments`
  - Objective: assign student to route/stop for academic year.
  - FK: `student_id`, `route_id`, `stop_id`, `academic_year_id`, `tenant_id`.
  - Key constraints/indexes:
    - `uq_student_transport_assignments_student_year`
    - route/status lookup index.

### 7) Communication, Documents, and Auditing

- `notifications`, `user_notifications`
  - Objective: announcements/alerts and read state per user.
  - FK:
    - `notifications -> tenants/schools`, optional `sender_id -> users.id`
    - `user_notifications -> notifications/users/tenants`.
  - Key constraints/indexes:
    - `uq_user_notifications_notification_user`
    - target and read-state indexes.

- `messages`
  - Objective: direct sender-recipient messaging.
  - FK: `sender_id -> users.id`, `recipient_id -> users.id`, plus tenant/school.
  - Key constraints/indexes:
    - sender/recipient index
    - tenant/school/time index.

- `documents`
  - Objective: shared document metadata table for all entity types.
  - Pattern: polymorphic (`entity_type`, `entity_id`) + external storage pointer (`storage_bucket`, `storage_key`).
  - FK: `tenant_id`, optional `uploaded_by_id -> users.id`.
  - Key constraints/indexes:
    - `idx_documents_entity_lookup`
    - `idx_documents_storage_key`.

- `audit_logs`
  - Objective: immutable audit event history.
  - FK: `tenant_id`, optional actor user.
  - Key constraints/indexes:
    - `idx_audit_logs_tenant_created_at`
    - `idx_audit_logs_entity_lookup`.

## High-Value Relationship Paths

- Tenant graph: `tenants -> schools -> campuses -> class_rooms -> enrollments -> students`.
- Academic ops: `class_rooms -> classroom_subjects -> subjects/teacher_profiles`.
- Attendance: `attendance_sessions -> attendance_records -> students`.
- Billing: `students -> invoices -> invoice_lines` and `payments -> payment_allocations -> invoices`.
- Transport: `transport_routes -> transport_stops` and `students -> student_transport_assignments -> routes/stops`.
- Communication: `notifications -> user_notifications -> users`; `messages.sender/recipient -> users`.

## Index Strategy Summary

- Uniqueness where business keys are tenant/school scoped (e.g., admission number, route code, receipt number).
- Composite indexes for common list queries:
  - status/date based (`invoices`, `payments`, `attendance`)
  - tenant/school scoping
  - relation lookup tables (assignments/joins).
- Explicit indexes on high-cardinality FK patterns used in dashboards and admin list screens.

## Plan.md Coverage Check (Current)

- Covered:
  - Multi-tenancy, RBAC, students/guardians, staff/teachers, classes/subjects, timetable, attendance, transport, fees/invoices/payments, notifications/messages, sessions, documents, audit logs.

- Partially covered:
  - `school_id` on every table:
    - Most operational tables have it.
    - Some global/shared tables intentionally rely on `tenant_id` and/or indirect FK paths.
  - Transport modeling:
    - We model stops directly under route (`transport_stops` with `route_id`).
    - Plan text also suggested a separate `route_stops` join style.
  - Fee model naming:
    - We use `fee_plans/fee_items` rather than `fee_categories/class_fees`.
    - Functionally equivalent for MVP, but naming differs.

- Missing (from plan expectations) and recommended next migration:
  - `created_by_id`/`updated_by_id`/`deleted_by_id` + `deleted_at` are now present across major models, but currently as scalar columns (no FK constraints to `users.id` yet).
  - Decide on strict `school_id` policy:
    - either add `school_id` to every domain table, or
    - keep current normalized tenant-centric pattern and document exceptions.
  - Optional: introduce explicit `route_stops` if routes must reuse the same stop entities across different route versions.

## Suggested Next Migration Scope

- `audit-and-soft-delete-hardening`:
  - done: added `created_by_id`, `updated_by_id`, `deleted_at`, `deleted_by_id` to core entities.
  - done: added per-table `deleted_at` indexes.
  - pending decision: whether to enforce `created_by_id`/`updated_by_id`/`deleted_by_id` FKs to `users.id`.

- `transport-shape-decision`:
  - keep current `transport_stops(route_id)` or migrate to `route_stops` join model.
