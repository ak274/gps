import { HttpError } from '@gps/web-data-access-http';
import { z } from 'zod';

import {
  classroomsResponseSchema,
  createEnrollmentSchema,
  enrollmentSchema,
  enrollmentsResponseSchema,
  studentsFiltersSchema,
  studentsResponseSchema,
} from './schemas';

function parseWithEnv<T>(schema: z.ZodType<T>, value: unknown): T {
  if (import.meta.env.PROD) {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      throw new HttpError({
        status: 500,
        message: 'Response validation failed',
        body: {
          code: 'RESPONSE_VALIDATION_FAILED',
          message: 'Response validation failed',
          details: parsed.error.flatten(),
        },
      });
    }
    return parsed.data;
  }
  return schema.parse(value);
}

async function apiJson<T>(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  path: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}${path}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new HttpError({
      status: response.status,
      message: typeof body?.message === 'string' ? body.message : `HTTP ${response.status}`,
      body: body && typeof body === 'object' ? { code: String(body.code), message: String(body.message) } : null,
    });
  }

  return parseWithEnv(schema, body);
}

export async function listStudents(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  filters: unknown,
) {
  const parsed = studentsFiltersSchema.parse(filters);
  const query = new URLSearchParams({
    page: String(parsed.page),
    pageSize: String(parsed.pageSize),
  });

  if (parsed.search) query.set('search', parsed.search);
  if (parsed.schoolId) query.set('schoolId', parsed.schoolId);

  return apiJson(authFetch, `/api/students?${query.toString()}`, studentsResponseSchema);
}

export async function listClassrooms(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  return apiJson(authFetch, '/api/classrooms', classroomsResponseSchema);
}

export async function listStudentEnrollments(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  studentId: string,
) {
  return apiJson(
    authFetch,
    `/api/enrollments?studentId=${encodeURIComponent(studentId)}`,
    enrollmentsResponseSchema,
  );
}

export async function createEnrollment(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  input: unknown,
) {
  const parsed = createEnrollmentSchema.parse(input);
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}/api/enrollments`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...parsed,
      status: parsed.status ?? 'ACTIVE',
    }),
  });

  const body = await response.json().catch(() => undefined);

  if (!response.ok) {
    throw new HttpError({
      status: response.status,
      message: typeof body?.message === 'string' ? body.message : `HTTP ${response.status}`,
      body: body && typeof body === 'object' ? { code: String(body.code), message: String(body.message) } : null,
    });
  }

  return parseWithEnv(enrollmentSchema, body);
}
