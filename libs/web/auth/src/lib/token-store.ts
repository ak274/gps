import { z } from 'zod';

import type { AuthTokens } from './auth.types';

const storageKey = 'gps.auth.tokens';

const tokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1).optional(),
});

export function readTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  // Some environments (tests, hardened browsers) may not expose a functional localStorage.
  if (typeof localStorage?.getItem !== 'function') return null;

  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;

  // In prod: safeParse to avoid breaking the whole app due to bad storage.
  if (import.meta.env.PROD) {
    const parsed = tokensSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  }

  // In dev: throw early so we notice contract drift.
  return tokensSchema.parse(JSON.parse(raw));
}

export function writeTokens(tokens: AuthTokens | null) {
  if (typeof window === 'undefined') return;
  if (typeof localStorage?.setItem !== 'function') return;

  if (!tokens) {
    localStorage.removeItem(storageKey);
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify(tokens));
}
