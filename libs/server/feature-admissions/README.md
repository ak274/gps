# @gps/feature-admissions

NestJS feature library for admissions workflow (applications + enrollment handoff).

**Routes**
- `GET /api/admissions/applications` (scope: `admissions.read`)
- `GET /api/admissions/applications/:applicationId` (scope: `admissions.read`)
- `POST /api/admissions/applications` (scope: `admissions.write`)
- `PATCH /api/admissions/applications/:applicationId` (scope: `admissions.write`)
- `POST /api/admissions/applications/:applicationId/enroll` (scope: `admissions.write`)

**Workflow Notes**
- `AdmissionApplication.status` is validated for allowed transitions (e.g. `DRAFT -> SUBMITTED -> REVIEWING -> APPROVED/REJECTED -> ENROLLED`).
- Timestamp fields are filled automatically on state changes:
  - `submittedAt` for non-draft statuses
  - `reviewedAt` when entering `REVIEWING`
  - `decidedAt` when entering `APPROVED` or `REJECTED`
- `enroll` creates `Student`, `Guardian`, `StudentGuardian`, and (optionally) `Enrollment`, then sets application status to `ENROLLED`.
