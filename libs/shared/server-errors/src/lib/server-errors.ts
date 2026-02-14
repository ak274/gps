import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

type ErrorDetails = Record<string, unknown>;

type ApiErrorPayload = {
  code: string;
  message: string;
  details?: ErrorDetails;
};

function payload(code: string, message: string, details?: ErrorDetails): ApiErrorPayload {
  return {
    code,
    message,
    ...(details ? { details } : {}),
  };
}

export function apiBadRequest(code: string, message: string, details?: ErrorDetails) {
  return new BadRequestException(payload(code, message, details));
}

export function apiUnauthorized(code: string, message: string, details?: ErrorDetails) {
  return new UnauthorizedException(payload(code, message, details));
}

export function apiForbidden(code: string, message: string, details?: ErrorDetails) {
  return new ForbiddenException(payload(code, message, details));
}

export function apiNotFound(code: string, message: string, details?: ErrorDetails) {
  return new NotFoundException(payload(code, message, details));
}

export function apiConflict(code: string, message: string, details?: ErrorDetails) {
  return new ConflictException(payload(code, message, details));
}

export function apiUnprocessable(code: string, message: string, details?: ErrorDetails) {
  return new UnprocessableEntityException(payload(code, message, details));
}
