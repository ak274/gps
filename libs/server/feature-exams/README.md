# @gps/feature-exams

NestJS feature library for exam management (exams, exam subjects, student assessments).

**Routes**
- `GET /api/exams` (scope: `exams.read`)
- `GET /api/exams/:examId` (scope: `exams.read`)
- `POST /api/exams` (scope: `exams.write`)
- `PATCH /api/exams/:examId` (scope: `exams.write`)
- `DELETE /api/exams/:examId` (scope: `exams.write`)
- `POST /api/exams/:examId/publish` (scope: `exams.write`)
- `POST /api/exams/:examId/complete` (scope: `exams.write`)
- `GET /api/exams/:examId/assessments` (scope: `exams.read`)
- `POST /api/exams/:examId/assessments:bulk-upsert` (scope: `exams.write`)
- `POST /api/exams/:examId/assessments:publish` (scope: `exams.write`)

**Notes**
- All queries are tenant-scoped via `tenantId` from the authenticated JWT payload.
- Soft-delete is implemented via `deletedAt`/`deletedById`.
- Status rules:
  - `publish`: `DRAFT -> PUBLISHED` (idempotent if already `PUBLISHED`/`COMPLETED`)
  - `complete`: `PUBLISHED -> COMPLETED`
- Marks entry:
  - `StudentAssessment` is unique per `(examSubjectId, studentId)`.
  - Assessments can be entered while the exam is `DRAFT` or `PUBLISHED`.
  - Publishing assessments sets `publishedAt` for all assessments on the exam and will auto-complete the exam if it is currently `PUBLISHED`.
