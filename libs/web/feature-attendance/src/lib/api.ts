import { HttpError } from '@gps/web-data-access-http';
import { z } from 'zod';

import { type AttendanceMarkInput, attendanceRecordsSchema, attendanceSessionsSchema } from './schemas';

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

export async function listAttendanceSessions(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const response = await authFetch(`${apiBase}/api/attendance/sessions`, {
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

  return parseWithEnv(attendanceSessionsSchema, body);
}

export async function markAttendance(
  authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
  input: AttendanceMarkInput,
) {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const studentIds = input.studentIdsCsv
    ? input.studentIdsCsv
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
    : undefined;

  const response = await authFetch(`${apiBase}/api/attendance/sessions/${input.sessionId}/records:mark`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      status: input.status,
      studentIds,
      remainingStatus: input.remainingStatus,
      remarks: input.remarks || undefined,
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

  return parseWithEnv(attendanceRecordsSchema, body);
}
