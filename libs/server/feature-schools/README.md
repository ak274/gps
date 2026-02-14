# @gps/feature-schools

School management APIs scoped to authenticated tenant.

## Endpoints

- `GET /api/schools` (scope: `schools.read`)
- `GET /api/schools/:schoolId` (scope: `schools.read`)
- `POST /api/schools` (scope: `schools.write`)
- `PATCH /api/schools/:schoolId` (scope: `schools.write`)

## Design

- All queries are constrained by JWT `tenantId`.
- Soft-deleted schools are excluded.
- `code` is enforced unique per tenant (conflict check on create).
- DTO validation and Swagger docs are included.
