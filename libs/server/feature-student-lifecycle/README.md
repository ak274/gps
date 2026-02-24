# @gps/feature-student-lifecycle

Student lifecycle APIs: promotions, graduation/completion, exit/transfer requests, and academic session rollover helpers.

## Promotion / Graduation

Routes (scopes):
- `POST /api/lifecycle/promotion-batches` (`students.lifecycle.write`)
- `GET /api/lifecycle/promotion-batches` (`students.lifecycle.read`)
- `GET /api/lifecycle/promotion-batches/:batchId` (`students.lifecycle.read`)
- `GET /api/lifecycle/promotion-batches/:batchId/preview` (`students.lifecycle.read`)
- `GET /api/lifecycle/promotion-batches/:batchId/letters` (`students.lifecycle.read`)
- `PATCH /api/lifecycle/promotion-batches/:batchId/mappings` (`students.lifecycle.write`)
- `PATCH /api/lifecycle/promotion-batches/:batchId/overrides` (`students.lifecycle.write`)
- `POST /api/lifecycle/promotion-batches/:batchId/apply` (`students.lifecycle.write`)

## Exit / Transfer

Routes (scopes):
- `POST /api/lifecycle/exit-requests` (`students.exit.request`)
- `GET /api/lifecycle/exit-requests` (`students.exit.read`)
- `GET /api/lifecycle/exit-requests/:exitRequestId` (`students.exit.read`)
- `POST /api/lifecycle/exit-requests/:exitRequestId/approve` (`students.exit.approve`)
- `POST /api/lifecycle/exit-requests/:exitRequestId/reject` (`students.exit.approve`)
- `POST /api/lifecycle/exit-requests/:exitRequestId/complete` (`students.exit.approve`)
- `GET /api/lifecycle/exit-requests/:exitRequestId/certificate` (`students.exit.read`)

## Session Rollover

Routes (scopes):
- `POST /api/lifecycle/rollover/academic-structure:copy` (`academics.rollover.write`)
- `POST /api/lifecycle/rollover/set-current-academic-year` (`academics.rollover.write`)
