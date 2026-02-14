# @gps/feature-documents

Documents/attachments metadata APIs for multi-entity linking and tenant-safe retrieval.

## Endpoints

- `GET /api/documents` (`documents.read`)
- `GET /api/documents/:documentId` (`documents.read`)
- `POST /api/documents` (`documents.write`)
- `DELETE /api/documents/:documentId` (`documents.write`)

## Design Notes

- Document binaries are expected in object storage; this module stores metadata only.
- Tenant isolation enforced via JWT `tenantId`.
- Supports polymorphic entity linking using `entityType + entityId`.
- Soft delete is applied (`deletedAt`, `deletedById`) for metadata retention.
- Response includes `downloadUrl` placeholder built from bucket/key.
- DTO validation and Swagger docs included for all routes.
