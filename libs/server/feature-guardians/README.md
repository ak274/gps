# @gps/feature-guardians

Guardian and student-guardian linking APIs.

## Endpoints

- `GET /api/guardians` (`guardians.read`)
- `GET /api/guardians/:guardianId` (`guardians.read`)
- `POST /api/guardians` (`guardians.write`)
- `PATCH /api/guardians/:guardianId` (`guardians.write`)
- `POST /api/guardians/:guardianId/students/:studentId` (`guardians.write`)
- `DELETE /api/guardians/:guardianId/students/:studentId` (`guardians.write`)
- `GET /api/guardians/student/:studentId` (`guardians.read`)
- `GET /api/guardians/student/:studentId/siblings` (`guardians.read`)

## Notes

- Tenant isolation enforced by JWT `tenantId`.
- Soft-deleted rows are excluded from reads and links.
- Linking validates same-school guardians/students.
- Supports primary guardian semantics per student.
- Uses stable machine error codes via `@gps/server-errors`.
