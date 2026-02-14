# @gps/feature-tenants

Tenant management APIs (current-tenant context) for authenticated users.

## Endpoints

- `GET /api/tenants/current` (scope: `tenants.read`)
- `PATCH /api/tenants/current` (scope: `tenants.write`)

## Design

- Tenant is always resolved from JWT `tenantId`.
- Soft-deleted tenants are excluded.
- DTO validation and Swagger docs are included.
