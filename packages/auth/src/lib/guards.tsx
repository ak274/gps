import { useEffect, type PropsWithChildren, type ReactNode } from 'react';

import { canAccess, type AbacPolicy, type AbacRuleContext } from './abac';
import { useAuth } from './auth.context';
import type { AuthUser } from './types';

export function canGuard(args: {
  user: AuthUser | null;
  permission: string;
  context?: AbacRuleContext;
  policy?: AbacPolicy;
}): boolean {
  return canAccess(args);
}

export function useGuard(permission: string, context?: AbacRuleContext): boolean {
  const auth = useAuth();
  return auth.can(permission, context);
}

export function Guard({
  permission,
  context,
  fallback = null,
  children,
}: PropsWithChildren<{
  permission: string;
  context?: AbacRuleContext;
  fallback?: ReactNode;
}>): ReactNode {
  const allowed = useGuard(permission, context);
  if (!allowed) return fallback;
  return children;
}

export function useRequireAuth(options: {
  onRedirect: () => void | Promise<void>;
  enabled?: boolean;
}): boolean {
  const auth = useAuth();
  const enabled = options.enabled ?? true;
  const onRedirect = options.onRedirect;

  useEffect(() => {
    if (!enabled) return;
    if (auth.isInitializing) return;
    if (auth.isAuthenticated) return;
    void onRedirect();
  }, [auth.isAuthenticated, auth.isInitializing, enabled, onRedirect]);

  return auth.isAuthenticated;
}

export function useRequireGuest(options: {
  onRedirect: () => void | Promise<void>;
  enabled?: boolean;
}): boolean {
  const auth = useAuth();
  const enabled = options.enabled ?? true;
  const onRedirect = options.onRedirect;

  useEffect(() => {
    if (!enabled) return;
    if (auth.isInitializing) return;
    if (!auth.isAuthenticated) return;
    void onRedirect();
  }, [auth.isAuthenticated, auth.isInitializing, enabled, onRedirect]);

  return !auth.isAuthenticated;
}
