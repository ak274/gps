# GPS MVP Feature Gap Analysis (Current Backend)

This file maps your MVP plan modules to the current backend implementation status.

## Implemented (Backend APIs present)

- Auth + JWT + session/refresh rotation
- RBAC (roles, permissions, user-tenant role assignment)
- Tenants (current tenant)
- Schools
- Students (read APIs; full CRUD pending)
- Academics: classrooms, subjects, enrollments
- Timetable entries
- Attendance (students + teachers)
- Transport (vehicles/routes/stops/assignments)
- Billing (fee plans, invoices, payments, allocations)
- Communications (notifications, direct messaging)
- Documents metadata module
- Exams (CRUD + exam subjects on create; assessments endpoints pending)
- Homework/diary (CRUD)

## Newly Added in this pass

- Class sections operations in academics:
  - Bulk create class with sections
  - List classes grouped by sections
  - Conflict-safe section uniqueness per class/year

## Missing or Partial (High Priority)

- Student + Guardian full lifecycle:
  - Guardians CRUD + linking + sibling views ✅
  - Students CRUD + bulk import pending
- Admissions workflows (online registration, verification state machine)
- Teacher/Staff profile management APIs ✅
- Parent-facing views (child profile/attendance/fees aggregates)
- Timetable substitutions + conflict workflow APIs
- Attendance reports/export/alerts workflows
- Exam & assessment module (marks entry, report cards)

## Missing (Next Priority)

- Library management
- Inventory/asset management
- Events/calendar/tasks
- Reporting & analytics endpoints
- Integrations (payment gateway callbacks, accounting sync adapters)

## Multi-school / campus model

- Kept intact.
- Existing schema and APIs remain tenant-scoped with school/campus support.
