import { z, type ZodSchema } from 'zod';

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export class HttpError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(args: { status: number; message: string; body: ApiErrorBody | null }) {
    super(args.message);
    this.name = 'HttpError';
    this.status = args.status;
    this.body = args.body;
  }
}

export type HttpJsonOptions<T> = {
  init?: RequestInit;
  schema?: ZodSchema<T>;
};

const defaultErrorBodySchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  details: z.unknown().optional(),
  requestId: z.string().optional(),
});

export async function httpJson<T = unknown>(
  input: RequestInfo | URL,
  options: HttpJsonOptions<T> = {},
): Promise<T> {
  const res = await fetch(input, {
    ...options.init,
    headers: {
      accept: 'application/json',
      ...(options.init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    const raw = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
    const parsed = defaultErrorBodySchema.safeParse(raw);
    const body = parsed.success ? parsed.data : null;

    throw new HttpError({
      status: res.status,
      message: body?.message ?? `HTTP ${res.status}`,
      body,
    });
  }

  if (!isJson) {
    // Caller asked for JSON but server didn't respond with JSON.
    throw new HttpError({
      status: res.status,
      message: 'Expected JSON response',
      body: { code: 'UNEXPECTED_CONTENT_TYPE', message: 'Expected JSON response' },
    });
  }

  const data = await res.json();
  if (!options.schema) return data as T;

  if (import.meta.env.PROD) {
    const parsed = options.schema.safeParse(data);
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

  return options.schema.parse(data);
}

