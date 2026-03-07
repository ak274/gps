import type { AuthUser } from './types';

export type AbacRuleContext = Record<string, unknown> | undefined;

export type AbacRule = (args: {
  user: AuthUser;
  context?: AbacRuleContext;
}) => boolean;

export type AbacPolicy = Record<string, AbacRule>;

export function canAccess(args: {
  user: AuthUser | null;
  permission: string;
  context?: AbacRuleContext;
  policy?: AbacPolicy;
}): boolean {
  const { user, permission, context, policy } = args;
  if (!user) return false;

  // First trust explicit scopes provided by backend authorization.
  if (user.scopes.includes(permission)) return true;

  const rule = policy?.[permission];
  if (!rule) return false;
  return rule({ user, context });
}

