# @gps/web-feature-students

Domain feature boundary for student-facing admin pages.

## Exports

- `StudentsPage`

## Notes

- Uses `react-hook-form` + `zodResolver`.
- Uses `@tanstack/react-table` + shadcn table pattern for list views.
- Shows current class/section via enrollments mapping.
- Supports assigning unassigned students to class/section.
- Uses `@gps/auth` guards and `authFetch`.
