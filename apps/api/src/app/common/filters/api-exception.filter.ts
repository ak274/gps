import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiErrorResponse, ApiValidationIssue } from '../errors/api-error-response';

function statusCodeToErrorCode(statusCode: number): string {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return 'BAD_REQUEST';
    case HttpStatus.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HttpStatus.FORBIDDEN:
      return 'FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'NOT_FOUND';
    case HttpStatus.CONFLICT:
      return 'CONFLICT';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'UNPROCESSABLE_ENTITY';
    case HttpStatus.TOO_MANY_REQUESTS:
      return 'TOO_MANY_REQUESTS';
    default:
      return statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR';
  }
}

function getExceptionPayload(exception: HttpException): {
  code?: string;
  message?: string;
  details?: ApiValidationIssue[] | Record<string, unknown>;
} {
  const response = exception.getResponse();

  if (typeof response === 'string') {
    return { message: response };
  }

  if (typeof response === 'object' && response !== null) {
    const obj = response as Record<string, unknown>;

    const rawDetails = obj.details ?? (Array.isArray(obj.message) ? obj.message : undefined);
    const details = Array.isArray(rawDetails)
      ? (rawDetails as ApiValidationIssue[])
      : rawDetails && typeof rawDetails === 'object'
        ? (rawDetails as Record<string, unknown>)
        : undefined;
    const message = typeof obj.message === 'string' ? obj.message : exception.message;
    const code = typeof obj.code === 'string' ? obj.code : undefined;

    return { code, message, details };
  }

  return { message: exception.message };
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (statusCode: number) => { json: (body: unknown) => void };
    }>();
    const request = ctx.getRequest<{ id?: string; url: string; method: string }>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = isHttpException ? getExceptionPayload(exception) : {};

    const body: ApiErrorResponse = {
      statusCode,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
      requestId: request.id,
      error: {
        code: payload.code ?? statusCodeToErrorCode(statusCode),
        message:
          payload.message ??
          (statusCode >= 500 ? 'Unexpected server error' : 'Request failed'),
        ...(payload.details !== undefined && payload.details !== null
          ? { details: payload.details }
          : {}),
      },
    };

    response.status(statusCode).json(body);
  }
}
