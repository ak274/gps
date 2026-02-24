# @gps/feature-homework

NestJS feature library for the homework/diary module (teacher assignments for classes/subjects).

**Routes**
- `GET /api/homework` (scope: `homework.read`)
- `GET /api/homework/:homeworkId` (scope: `homework.read`)
- `POST /api/homework` (scope: `homework.write`)
- `PATCH /api/homework/:homeworkId` (scope: `homework.write`)
- `DELETE /api/homework/:homeworkId` (scope: `homework.write`)

**Notes**
- All queries are tenant-scoped via `tenantId` from the authenticated JWT payload.
- Soft-delete is implemented via `deletedAt`/`deletedById`.
