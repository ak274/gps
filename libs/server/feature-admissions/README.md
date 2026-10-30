# @gps/feature-admissions

NestJS feature library for admissions workflow (applications + enrollment handoff).

**Routes**
- `GET /api/admissions/applications` (scope: `admissions.read`)
- `GET /api/admissions/applications/:applicationId` (scope: `admissions.read`)
- `POST /api/admissions/applications` (scope: `admissions.write`)
- `PATCH /api/admissions/applications/:applicationId` (scope: `admissions.write`)
- `POST /api/admissions/applications/:applicationId/enroll` (scope: `admissions.write`)

**Configurable Form Builder**
- `GET /api/admissions/forms?schoolId=...&academicYearId=...` (scope: `admissions.read`)
- `POST /api/admissions/forms` (scope: `admissions.write`)
- `POST /api/admissions/forms/:formId/sections` (scope: `admissions.write`)
- `POST /api/admissions/form-sections/:sectionId/fields` (scope: `admissions.write`)
- `POST /api/admissions/forms/:formId/documents` (scope: `admissions.write`)
- `POST /api/admissions/forms/:formId/publish` (scope: `admissions.write`)

**Admission Operations Workflow**
- `POST /api/admissions/applications/:applicationId/transition` (scope: `admissions.write`) moves an application through review, information request, decision, offer, fee-pending and final-verification stages.
- `GET /api/admissions/applications/:applicationId/timeline` (scope: `admissions.read`) returns the chronological audit trail.
- `POST /api/admissions/applications/:applicationId/documents` (scope: `admissions.write`) records a document against a configured requirement.
- `PATCH /api/admissions/applications/:applicationId/documents/:documentId/review` (scope: `admissions.write`) verifies or rejects a document with a review note.

Supported decision path: `DRAFT → SUBMITTED → REVIEWING → INFO_REQUESTED / APPROVED / WAITLISTED / REJECTED → OFFERED → FEE_PENDING → READY_FOR_ENROLLMENT → ENROLLED`. Office-created applications use the same path and can be marked with `applicationSource: OFFICE`.

Forms are versioned per school and academic year. Submitted applications preserve the form id, version and custom `formData`; required configured fields are validated at submission while drafts may remain incomplete. Fields and document rules can be marked sensitive for restricted-access workflows.

**Public Parent Journey**
- Share the portal route `/apply/:schoolId` with families; it is intentionally outside the authenticated dashboard shell.
- `GET /api/admissions/public/form/:schoolId` returns the currently published form.
- `POST /api/admissions/public/start` creates a verified, resumable lead session.
- `POST /api/admissions/public/:leadId/verify` unlocks the private draft space.
- `PATCH /api/admissions/public/:leadId/draft?resumeToken=...` autosaves answers and section position.
- `POST /api/admissions/public/:leadId/submit?resumeToken=...` creates the submitted admission application.

The verification code is returned as a local-development preview until an outbound email provider is configured. Production must connect that code generation step to the school’s email delivery provider before enabling the public journey.

**Workflow Notes**
- `AdmissionApplication.status` is validated for allowed transitions (e.g. `DRAFT -> SUBMITTED -> REVIEWING -> APPROVED/REJECTED -> ENROLLED`).
- Timestamp fields are filled automatically on state changes:
  - `submittedAt` for non-draft statuses
  - `reviewedAt` when entering `REVIEWING`
  - `decidedAt` when entering `APPROVED` or `REJECTED`
- `enroll` creates `Student`, `Guardian`, `StudentGuardian`, and (optionally) `Enrollment`, then sets application status to `ENROLLED`.
