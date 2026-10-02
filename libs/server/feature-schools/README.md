# @gps/feature-schools

School management APIs scoped to authenticated tenant.

## Endpoints

- `GET /api/schools` (scope: `schools.read`)
- `GET /api/schools/:schoolId` (scope: `schools.read`)
- `POST /api/schools` (scope: `schools.write`)
- `POST /api/schools/provision` (scope: `schools.write`) — creates a school, its initial campus, an invited administrator membership, role assignment, and school assignment transactionally.
- `GET /api/schools/platform/tenants` (platform admin) — lists all institutions and school counts.
- `GET /api/schools/platform/all` (platform admin) — lists all schools across institutions.
- `POST /api/schools/platform/provision` (platform admin) — provisions a school under a selected institution.
- `PATCH /api/schools/:schoolId` (scope: `schools.write`)
- `GET /api/schools/campuses` (scope: `schools.read`)
- `GET /api/schools/campuses/:campusId` (scope: `schools.read`)
- `POST /api/schools/campuses` (scope: `schools.write`)
- `PATCH /api/schools/campuses/:campusId` (scope: `schools.write`)
- `GET /api/schools/admin-assignments` (scope: `schools.read`)
- `POST /api/schools/admin-assignments` (scope: `schools.write`)
- `DELETE /api/schools/admin-assignments/:assignmentId` (scope: `schools.write`)

## Design

- All queries are constrained by JWT `tenantId`.
- Soft-deleted schools are excluded.
- Soft-deleted campuses and admin assignments are excluded.
- `code` is enforced unique per tenant (conflict check on create).
- Campus `code` is enforced unique per school.
- School access can be restricted per tenant membership when assignment rows exist.
- Assignment API validates that target membership has an admin role (`admin`, `tenant_admin`, `school_admin`).
- DTO validation and Swagger docs are included.
