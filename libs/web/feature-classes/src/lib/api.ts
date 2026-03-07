import { HttpError } from '@gps/web-data-access-http';
import { z } from 'zod';

import {
  classFiltersSchema,
  classWithSectionsResponseSchema,
  createClassWithSectionsSchema,
  classWithSectionsSchema,
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

export async function listClassesWithSections(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  filters: unknown,
) {
  const parsed = classFiltersSchema.parse(filters);
  const query = new URLSearchParams();

  if (parsed.schoolId) query.set('schoolId', parsed.schoolId);
  if (parsed.academicYearId) query.set('academicYearId', parsed.academicYearId);
  if (parsed.search) query.set('search', parsed.search);

  const path = query.size > 0 ? `/api/classrooms/with-sections?${query.toString()}` : '/api/classrooms/with-sections';
  return apiJson(authFetch, path, classWithSectionsResponseSchema);
}

export async function createClassWithSections(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  input: unknown,
) {
  const parsed = createClassWithSectionsSchema.parse(input);
  const sections = parsed.sectionsCsv
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}/api/classrooms/with-sections`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      schoolId: parsed.schoolId,
      campusId: parsed.campusId || undefined,
      academicYearId: parsed.academicYearId,
      name: parsed.name,
      gradeLevel: parsed.gradeLevel,
      sections,
      capacity: parsed.capacity,
      homeRoomTeacherId: parsed.homeRoomTeacherId || undefined,
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

  return parseWithEnv(classWithSectionsSchema, body);
}
