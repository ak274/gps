# @gps/feature-documents

Documents/attachments metadata APIs for multi-entity linking and tenant-safe retrieval.

## Endpoints

- `GET /api/documents` (`documents.read`)
- `GET /api/documents/:documentId` (`documents.read`)
- `GET /api/documents/:documentId/audit` (`documents.read`) lists document upload, review and deletion history.
- `POST /api/documents` (`documents.write`)
- `PATCH /api/documents/:documentId/review` (`documents.review`) records a review decision, note, reviewer and optional expiry date.
- `POST /api/documents/expiry-reminders/run?days=30` (`documents.review`) marks expired verified evidence and creates deduplicated renewal tasks and in-app notifications for upcoming expiries.
- `DELETE /api/documents/:documentId` (`documents.write`)

Review statuses are `PENDING`, `IN_REVIEW`, `VERIFIED`, `REJECTED`, `NEEDS_INFORMATION` and `EXPIRED`. Rejection and needs-information outcomes require an explanatory note so the next school-office action is clear.

## Design Notes

- Document binaries are expected in object storage; this module stores metadata only.
- Tenant isolation enforced via JWT `tenantId`.
- Supports polymorphic entity linking using `entityType + entityId`.
- Soft delete is applied (`deletedAt`, `deletedById`) for metadata retention.
- Response includes `downloadUrl` placeholder built from bucket/key.
- DTO validation and Swagger docs included for all routes.
