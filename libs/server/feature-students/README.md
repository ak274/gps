# @gps/feature-students

NestJS feature library for tenant-scoped student APIs (CRUD + bulk import).

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

- `POST /api/students` (scope: `students.write`)
  - Creates a student (unique admission number per school).

- `PATCH /api/students/:studentId` (scope: `students.write`)
  - Updates a student.

- `DELETE /api/students/:studentId` (scope: `students.write`)
  - Soft deletes a student.

- `POST /api/students/bulk-import` (scope: `students.write`)
  - Bulk import students via JSON array payload.

- `POST /api/students/bulk-import/csv` (scope: `students.write`)
  - Bulk import students via CSV upload (multipart/form-data).
  - Expected headers: `admissionNo,firstName,lastName,gender,dateOfBirth,joinedOn,profilePhotoKey`

## Design

- Reads only non-deleted records (`deleted_at IS NULL`).
- Enforces tenant isolation using JWT `tenantId`.
- Uses DTO validation via `class-validator` and transformation via `class-transformer`.
- Swagger annotations are provided for request/response contracts.

## Error Codes

- `STUDENT_NOT_FOUND` (`404`) when `GET /api/students/:studentId` does not match tenant data.
- `STUDENT_ADMISSION_NO_CONFLICT` (`409`) when `(schoolId, admissionNo)` already exists.
- `STUDENTS_IMPORT_FILE_MISSING` (`422`) when CSV upload is missing/empty.
- `STUDENTS_IMPORT_INVALID_ROWS` (`422`) when CSV rows are missing required fields.
