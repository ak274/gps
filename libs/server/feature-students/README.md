# @gps/feature-students

NestJS feature library for tenant-scoped student read APIs.

## Endpoints

- `GET /api/students` (scope: `students.read`)
  - Query params:
    - `schoolId?`
    - `status?` (`EnrollmentStatus`)
    - `search?` (admission no / first name / last name)
    - `page` (default `1`)
    - `pageSize` (default `20`, max `100`)

- `GET /api/students/:studentId` (scope: `students.read`)
  - Returns one student within authenticated tenant.

## Design

- Reads only non-deleted records (`deleted_at IS NULL`).
- Enforces tenant isolation using JWT `tenantId`.
- Uses DTO validation via `class-validator` and transformation via `class-transformer`.
- Swagger annotations are provided for request/response contracts.

## Error Codes

- `STUDENT_NOT_FOUND` (`404`) when `GET /api/students/:studentId` does not match tenant data.
