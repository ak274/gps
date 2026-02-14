# @gps/api

NestJS API application for the GPS backend.

## Platform Standards

### Logging

- Uses `nestjs-pino` (`pino` + `pino-http`) as the app logger.
- Request logs include a request id (`requestId`) that is also returned in error responses.
- Sensitive fields are redacted from logs:
  - `authorization`, `cookie`, `password`, `passwordHash`, `refreshToken`.

### Error Response Contract

All handled and unhandled errors are normalized into this structure:

```json
{
  "statusCode": 400,
  "path": "/api/auth/login",
  "method": "POST",
  "timestamp": "2026-02-14T12:34:56.789Z",
  "requestId": "req-123",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "rule": "isEmail",
        "message": "email must be an email"
      }
    ]
  }
}
```

### Validation

- Global `ValidationPipe` is enabled with:
  - `transform: true`
  - `whitelist: true`
  - `forbidNonWhitelisted: true`
- Validation failures return `error.code = VALIDATION_ERROR` with structured field-level `details`.

### Exception Handling

- A global exception filter formats all `HttpException` and unexpected server errors.
- For unexpected server errors, consumers always receive a predictable payload with:
  - `statusCode = 500`
  - `error.code = INTERNAL_SERVER_ERROR`
  - `error.message = Unexpected server error`
