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

## Student records and safeguards

- `GET /api/students/:studentId/documents` (`students.read`) returns the detailed required/optional checklist and review state.
- `POST /api/students/:studentId/documents` (`students.write`) creates or updates a requirement record and links uploaded metadata from object storage.
- `PATCH /api/students/:studentId/documents/:documentId` (`students.write`) verifies, rejects or expires a document record.
- `GET /api/students/:studentId/medical-profile` (`students.read`) returns the restricted medical/support profile.
- `PUT /api/students/:studentId/medical-profile` (`students.write`) upserts the restricted medical/support profile.

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
- `POST /api/students/bulk-import/csv/preview` (scope: `students.write`) parses and validates a CSV without writing records.
- `POST /api/students/bulk-import` (scope: `students.write`) commits the reviewed JSON records.

## Family relationships

Families are tenant-level records that can connect students, guardians and alumni across the school's campuses. This keeps sibling relationships and family history in one place while allowing school-specific benefits to be configured for finance.

- `GET /api/students/families` (scope: `students.read`)
- `POST /api/students/families` (scope: `students.write`)
- `GET /api/students/families/:familyId` (scope: `students.read`)
- `POST /api/students/families/:familyId/students` (scope: `students.write`)
- `POST /api/students/families/:familyId/guardians` (scope: `students.write`)
- `POST /api/students/families/:familyId/alumni` (scope: `students.write`)
- `POST /api/students/families/:familyId/benefits` (scope: `students.write`)

Family benefits support percentage discounts, fixed discounts and waivers, optionally scoped to a fee plan and gated by the minimum number of enrolled family students. The finance invoice engine still needs to apply these configured benefits automatically during invoice generation.
