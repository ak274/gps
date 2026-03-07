export { AuthProvider, useAuth, type AuthContextValue } from './lib/auth.context';
export { canAccess, type AbacPolicy, type AbacRule } from './lib/abac';
export {
  Guard,
  useGuard,
  canGuard,
  useRequireAuth,
  useRequireGuest,
} from './lib/guards';
export { createAuthApi, type AuthApi } from './lib/api';
export { readSession as getStoredSession } from './lib/storage';
export type {
  AuthApiError,
  AuthFetch,
  AuthSession,
  AuthTokens,
  AuthUser,
  LoginInput,
  SignUpInput,
} from './lib/types';
