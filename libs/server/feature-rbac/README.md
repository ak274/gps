# @gps/feature-rbac

RBAC administration APIs for tenant roles, permissions, and user membership role assignments.

## Endpoints

- `GET /api/rbac/permissions` (`rbac.permissions.read`)
- `GET /api/rbac/roles` (`rbac.roles.read`)
- `GET /api/rbac/roles/:roleId` (`rbac.roles.read`)
- `POST /api/rbac/roles` (`rbac.roles.write`)
- `PATCH /api/rbac/roles/:roleId` (`rbac.roles.write`)
- `PUT /api/rbac/roles/:roleId/permissions` (`rbac.roles.write`)
- `GET /api/rbac/user-tenants/:userTenantId/roles` (`rbac.assignments.read`)
- `PUT /api/rbac/user-tenants/:userTenantId/roles` (`rbac.assignments.write`)

## Design Notes

- Tenant isolation is enforced via JWT `tenantId`.
- Permission catalog is global; role assignment is tenant-scoped.
- Replace semantics are used for role permissions and user-tenant role assignments.
- Soft-deleted role/assignment records are excluded from reads.
- DTO validation + Swagger docs included for all routes.
