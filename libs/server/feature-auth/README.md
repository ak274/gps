# @gps/feature-auth

NestJS auth feature library for JWT authentication, tenant-aware authorization scopes, and session-backed refresh tokens.

## Endpoints

- `POST /api/auth/login` (public)
  - Validates user credentials.
  - Resolves active tenant membership.
  - Issues access token + refresh token.
  - Creates a `sessions` row with hashed refresh token and expiry.

- `POST /api/auth/refresh` (public)
  - Accepts refresh token.
  - Validates non-revoked/non-expired session.
  - Rotates refresh token (revokes old session, creates new session).
  - Issues new access token + refresh token.

- `POST /api/auth/logout` (protected)
  - Revokes the current session by JWT `sid` (and optional refresh token hash fallback).

- `GET /api/auth/me` (protected, `auth.read`)
  - Returns current JWT payload.

## JWT Payload

`AuthenticatedUser` includes:

- `sub`: user id
- `sid`: session id
- `email`
- `tenantId`
- `tenantCode`
- `roles[]`
- `scopes[]`

## Guards and Decorators

- Global guards from `AuthModule`:
  - `JwtAuthGuard`
  - `ScopesGuard`
- Decorators:
  - `@Public()` for unauthenticated routes
  - `@Scopes(...scopes)` for permission checks
  - `@CurrentUser()` for typed JWT payload access

## Env Variables

- `JWT_SECRET`
- `JWT_EXPIRES_IN` (default: `15m`)
- `JWT_REFRESH_EXPIRES_IN` (default: `30d`)
- `JWT_ISSUER`
- `JWT_AUDIENCE`

## Notes

- Refresh tokens are never persisted in plaintext; SHA-256 hash is stored in `sessions.token`.
- Session rows are tenant scoped.
- Role scopes are computed from `user_role_assignments -> roles -> role_permissions -> permissions`.
