import { z } from 'zod';

import type {
  AuthApiError,
  AuthSession,
  LoginInput,
  LogoutInput,
  RefreshInput,
  SignUpInput,
} from './types';

export type AuthApi = {
  login: (input: LoginInput) => Promise<AuthSession>;
  signUp: (input: SignUpInput) => Promise<AuthSession>;
  refresh: (input: RefreshInput) => Promise<AuthSession>;
  logout: (input: LogoutInput) => Promise<void>;
  me: () => Promise<AuthSession['user']>;
};

const authSessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
  expiresIn: z.string(),
  refreshExpiresIn: z.string(),
  user: z.object({
    sub: z.string(),
    sid: z.string(),
    email: z.string().email(),
    tenantId: z.string(),
    tenantCode: z.string(),
    roles: z.array(z.string()),
    scopes: z.array(z.string()),
  }),
});

function toSession(payload: z.infer<typeof authSessionSchema>): AuthSession {
  return {
    user: payload.user,
    tokens: {
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      tokenType: payload.tokenType,
      expiresIn: payload.expiresIn,
      refreshExpiresIn: payload.refreshExpiresIn,
    },
  };
}

function createError(status: number, fallbackMessage: string, body?: unknown): AuthApiError {
  if (
    body &&
    typeof body === 'object' &&
    'code' in body &&
    'message' in body &&
    typeof (body as { code: unknown }).code === 'string' &&
    typeof (body as { message: unknown }).message === 'string'
  ) {
    return {
      status,
      code: (body as { code: string }).code,
      message: (body as { message: string }).message,
      details: (body as { details?: unknown }).details,
    };
  }

  return {
    status,
    code: 'AUTH_HTTP_ERROR',
    message: fallbackMessage,
  };
}

async function fetchJson<T>(
  url: string,
  init: RequestInit,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const isJson = (response.headers.get('content-type') ?? '').includes('application/json');
  const body = isJson ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    throw createError(response.status, `Auth request failed (${response.status})`, body);
  }

  if (import.meta.env.PROD) {
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      throw createError(500, 'Auth response validation failed', {
        code: 'AUTH_RESPONSE_VALIDATION_FAILED',
        message: 'Auth response validation failed',
        details: parsed.error.flatten(),
      });
    }
    return parsed.data;
  }

  return schema.parse(body);
}

export function createAuthApi(config?: { baseUrl?: string; getAccessToken?: () => string | null }): AuthApi {
  const baseUrl = config?.baseUrl ?? import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
  const authUrl = `${baseUrl}/api/auth`;

  const withBearer = (headers?: HeadersInit): HeadersInit => {
    const token = config?.getAccessToken?.();
    if (!token) return headers ?? {};
    return {
      ...(headers ?? {}),
      authorization: `Bearer ${token}`,
    };
  };

  return {
    login: async (input) => {
      const payload = await fetchJson(
        `${authUrl}/login`,
        { method: 'POST', body: JSON.stringify(input) },
        authSessionSchema,
      );
      return toSession(payload);
    },
    signUp: async (input) => {
      const payload = await fetchJson(
        `${authUrl}/signup`,
        { method: 'POST', body: JSON.stringify(input) },
        authSessionSchema,
      );
      return toSession(payload);
    },
    refresh: async (input) => {
      const payload = await fetchJson(
        `${authUrl}/refresh`,
        { method: 'POST', body: JSON.stringify(input) },
        authSessionSchema,
      );
      return toSession(payload);
    },
    logout: async (input) => {
      await fetchJson(
        `${authUrl}/logout`,
        { method: 'POST', body: JSON.stringify(input), headers: withBearer() },
        z.object({ success: z.boolean() }),
      );
    },
    me: async () => {
      return fetchJson(
        `${authUrl}/me`,
        { method: 'GET', headers: withBearer() },
        authSessionSchema.shape.user,
      );
    },
  };
}

