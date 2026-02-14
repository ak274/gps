# @gps/feature-timetable

Timetable domain APIs for weekly class schedules.

## Endpoints

- `GET /api/timetable/entries` (`timetable.read`)
- `GET /api/timetable/entries/:entryId` (`timetable.read`)
- `POST /api/timetable/entries` (`timetable.write`)
- `PATCH /api/timetable/entries/:entryId` (`timetable.write`)
- `DELETE /api/timetable/entries/:entryId` (`timetable.write`)

## Design Notes

- Tenant isolation is enforced using JWT `tenantId`.
- Entries are soft-deleted (`deleted_at`) and excluded from reads.
- `schoolId` is derived from `classRoomId` to keep consistency.
- Conflict handling is mapped from Prisma unique constraint:
  - `(classRoomId, dayOfWeek, startTime)` -> timetable slot collision.
- Time inputs support `HH:mm` / `HH:mm:ss` and are validated with DTOs.
- Swagger decorators and DTO validation are included for all routes.
