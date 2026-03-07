import { z } from 'zod';

import type { AuthSession } from './types';

const storageKey = 'gps.auth.session.v1';

const sessionSchema = z.object({
  user: z.object({
    sub: z.string(),
    sid: z.string(),
    email: z.string().email(),
    tenantId: z.string(),
    tenantCode: z.string(),
    roles: z.array(z.string()),
    scopes: z.array(z.string()),
    attributes: z.record(z.unknown()).optional(),
  }),
  tokens: z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    tokenType: z.string().min(1),
    expiresIn: z.string().min(1),
    refreshExpiresIn: z.string().min(1),
  }),
});

export function readSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  if (typeof localStorage?.getItem !== 'function') return null;

  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  const payload = JSON.parse(raw);
  if (import.meta.env.PROD) {
    const parsed = sessionSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  }
  return sessionSchema.parse(payload);
}

export function writeSession(session: AuthSession | null): void {
  if (typeof window === 'undefined') return;
  if (typeof localStorage?.setItem !== 'function') return;

  if (!session) {
    localStorage.removeItem(storageKey);
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(session));
}

