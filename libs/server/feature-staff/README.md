# @gps/feature-staff

Staff and teacher profile management APIs.

## Endpoints

- `GET /api/staff` (`staff.read`)
- `GET /api/staff/:staffId` (`staff.read`)
- `POST /api/staff` (`staff.write`)
- `PATCH /api/staff/:staffId` (`staff.write`)
- `GET /api/staff/teachers/list` (`teachers.read`)
- `GET /api/staff/teachers/:teacherId` (`teachers.read`)
- `POST /api/staff/teachers` (`teachers.write`)
- `PATCH /api/staff/teachers/:teacherId` (`teachers.write`)
- `POST /api/staff/import/csv/preview` (`staff.write`) — validates staff CSV rows without writing.
- `POST /api/staff/import` (`staff.write`) — creates invited users, memberships, staff roles and staff profiles for reviewed rows.

## Notes

- Tenant-scoped access by JWT `tenantId`.
- `StaffProfile` uniqueness checks for `employeeCode` and `(schoolId, userId)`.
- `TeacherProfile` is created from an existing staff profile.
- Uses stable machine error codes via `@gps/server-errors`.
