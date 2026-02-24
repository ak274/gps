# @gps/feature-attendance

Attendance domain APIs for student attendance sessions/records and teacher attendance.

## Endpoints

### Student Attendance Sessions
- `GET /api/attendance/sessions` (`attendance.sessions.read`)
- `GET /api/attendance/sessions/:sessionId` (`attendance.sessions.read`)
- `POST /api/attendance/sessions` (`attendance.sessions.write`)
- `POST /api/attendance/sessions/:sessionId/records:bulk-upsert` (`attendance.records.write`)
- `POST /api/attendance/sessions/:sessionId/records:mark` (`attendance.records.write`)
  - One-click marking helper:
    - If `studentIds` is omitted, applies `status` to all active students in the class.
    - If `studentIds` is provided, applies `status` to selected students.
    - If `remainingStatus` is also provided, applies it to all other active students in the class.

### Student Attendance Records
- `GET /api/attendance/records` (`attendance.records.read`)

### Teacher Attendance
- `GET /api/teacher-attendance` (`attendance.teachers.read`)
- `GET /api/teacher-attendance/:teacherAttendanceId` (`attendance.teachers.read`)
- `POST /api/teacher-attendance` (`attendance.teachers.write`)
- `PATCH /api/teacher-attendance/:teacherAttendanceId` (`attendance.teachers.write`)

## Design Notes

- All records are tenant-scoped using JWT `tenantId`.
- Soft-deleted rows are excluded.
- Session records are written using bulk upsert keyed by `(attendanceSessionId, studentId)`.
- Teacher attendance enforces one record per `(teacherId, attendanceOn)`.
- DTO validation and Swagger docs are included for all routes.
