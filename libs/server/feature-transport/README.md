# @gps/feature-transport

Transport domain APIs for vehicles, routes, stops, and student route assignments.

## Endpoints

### Vehicles
- `GET /api/transport/vehicles` (`transport.vehicles.read`)
- `POST /api/transport/vehicles` (`transport.vehicles.write`)
- `PATCH /api/transport/vehicles/:vehicleId` (`transport.vehicles.write`)

### Routes
- `GET /api/transport/routes` (`transport.routes.read`)
- `POST /api/transport/routes` (`transport.routes.write`)
- `PATCH /api/transport/routes/:routeId` (`transport.routes.write`)

### Stops
- `GET /api/transport/stops` (`transport.stops.read`)
- `POST /api/transport/stops` (`transport.stops.write`)
- `PATCH /api/transport/stops/:stopId` (`transport.stops.write`)

### Student Assignments
- `GET /api/transport/assignments` (`transport.assignments.read`)
- `POST /api/transport/assignments` (`transport.assignments.write`)
- `PATCH /api/transport/assignments/:assignmentId` (`transport.assignments.write`)

## Design Notes

- Every query is tenant-scoped using JWT `tenantId`.
- Soft-deleted rows are excluded.
- Uniqueness checks are enforced for:
  - vehicles by `(schoolId, vehicleNumber)`
  - routes by `(schoolId, code)`
  - assignments by `(studentId, academicYearId)`
- DTO validation and Swagger docs are included on all endpoints.
