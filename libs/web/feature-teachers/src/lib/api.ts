import { HttpError } from '@gps/web-data-access-http';
import { z } from 'zod';

import { teachersResponseSchema } from './schemas';

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

export async function listTeachers(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}/api/staff/teachers/list`, {
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

  return parseWithEnv(teachersResponseSchema, body);
}
