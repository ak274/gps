# @gps/web-data-access-http

Shared HTTP client utilities for browser apps.

## Error contract

This lib standardizes an error shape so the UI can handle failures predictably:

- `HttpError` includes `status` and optional structured `body`.
- `ApiErrorBody` includes `code`, `message`, optional `details`, optional `requestId`.

## Runtime validation

`httpJson(..., { schema })` validates response JSON:

- Production: `safeParse` and throws `HttpError(code=RESPONSE_VALIDATION_FAILED)` if invalid.
- Development: `parse` to fail fast.

