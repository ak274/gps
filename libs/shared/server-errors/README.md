# @gps/server-errors

Shared NestJS exception helpers for stable API error payloads.

## Purpose

- Standardize `error.code` and `error.message` shapes returned by services.
- Keep frontend error handling machine-readable and predictable.

## Helpers

- `apiBadRequest(code, message, details?)`
- `apiUnauthorized(code, message, details?)`
- `apiForbidden(code, message, details?)`
- `apiNotFound(code, message, details?)`
- `apiConflict(code, message, details?)`
- `apiUnprocessable(code, message, details?)`
