# @gps/feature-academics

Academics domain APIs for classrooms, subjects, and enrollments.

## Endpoints

### Classrooms
- `GET /api/classrooms` (`classrooms.read`)
- `GET /api/classrooms/with-sections` (`classrooms.read`)
- `GET /api/classrooms/:classroomId` (`classrooms.read`)
- `POST /api/classrooms` (`classrooms.write`)
- `POST /api/classrooms/with-sections` (`classrooms.write`)
- `PATCH /api/classrooms/:classroomId` (`classrooms.write`)

### Subjects
- `GET /api/subjects` (`subjects.read`)
- `GET /api/subjects/:subjectId` (`subjects.read`)
- `POST /api/subjects` (`subjects.write`)
- `PATCH /api/subjects/:subjectId` (`subjects.write`)

### Enrollments
- `GET /api/enrollments` (`enrollments.read`)
- `GET /api/enrollments/:enrollmentId` (`enrollments.read`)
- `POST /api/enrollments` (`enrollments.write`)
- `PATCH /api/enrollments/:enrollmentId` (`enrollments.write`)

## Behavior

- All reads/writes are tenant-scoped via JWT `tenantId`.
- Soft-deleted records are excluded.
- Conflict checks:
  - classroom duplicate by `(academicYearId, name, section)`
  - bulk section create conflicts for existing sections under same class/year
  - subject duplicate by `(schoolId, code)`
  - enrollment duplicate by `(studentId, academicYearId)`
- DTO validation with `class-validator` and transformation where needed.
- Swagger decorators included for all endpoints.
