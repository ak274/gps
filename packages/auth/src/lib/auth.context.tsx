import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

import { canAccess, type AbacPolicy, type AbacRuleContext } from './abac';
import { createAuthApi, type AuthApi } from './api';
import { readSession, writeSession } from './storage';
import type {
  AuthApiError,
  AuthFetch,
  AuthSession,
  LoginInput,
  SignUpInput,
} from './types';

export type AuthContextValue = {
  session: AuthSession | null;
  user: AuthSession['user'] | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (input: LoginInput) => Promise<AuthSession>;
  signUp: (input: SignUpInput) => Promise<AuthSession>;
  refresh: () => Promise<AuthSession | null>;
  logout: () => Promise<void>;
  authFetch: AuthFetch;
  can: (permission: string, context?: AbacRuleContext) => boolean;
  lastError: AuthApiError | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export type AuthProviderProps = PropsWithChildren<{
  api?: AuthApi;
  policy?: AbacPolicy;
}>;

export function AuthProvider({ children, api, policy }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => readSession());
  const [isInitializing, setIsInitializing] = useState(false);
  const [lastError, setLastError] = useState<AuthApiError | null>(null);
  const hydrated = useRef(false);

  const authApi = useMemo(
    () =>
      api ??
      createAuthApi({
        getAccessToken: () => session?.tokens.accessToken ?? null,
      }),
    [api, session?.tokens.accessToken],
  );

  const applySession = useCallback((next: AuthSession | null) => {
    setSession(next);
    writeSession(next);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      try {
        const next = await authApi.login(input);
        applySession(next);
        setLastError(null);
        return next;
      } catch (error) {
        setLastError(error as AuthApiError);
        throw error;
      }
    },
    [authApi, applySession],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      try {
        const next = await authApi.signUp(input);
        applySession(next);
        setLastError(null);
        return next;
      } catch (error) {
        setLastError(error as AuthApiError);
        throw error;
      }
    },
    [authApi, applySession],
  );

  const refresh = useCallback(async () => {
    if (!session?.tokens.refreshToken) return null;
    setIsInitializing(true);
    try {
      const next = await authApi.refresh({ refreshToken: session.tokens.refreshToken });
      applySession(next);
      setLastError(null);
      return next;
    } catch (error) {
      applySession(null);
      setLastError(error as AuthApiError);
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [authApi, applySession, session?.tokens.refreshToken]);

  const logout = useCallback(async () => {
    const refreshToken = session?.tokens.refreshToken;
    try {
      if (session) {
        await authApi.logout({ refreshToken });
      }
    } finally {
      applySession(null);
    }
  }, [authApi, applySession, session]);

  const authFetch = useCallback<AuthFetch>(
    async (input, init) => {
      const requestWithToken = (token: string | null) =>
        fetch(input, {
          ...init,
          headers: {
            ...(init?.headers ?? {}),
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
        });

      let response = await requestWithToken(session?.tokens.accessToken ?? null);
      if (response.status !== 401) {
        return response;
      }

      const refreshed = await refresh();
      if (!refreshed?.tokens.accessToken) {
        applySession(null);
        return response;
      }

      response = await requestWithToken(refreshed.tokens.accessToken);
      if (response.status === 401) {
        applySession(null);
      }
      return response;
    },
    [applySession, refresh, session?.tokens.accessToken],
  );

  const can = useCallback(
    (permission: string, context?: AbacRuleContext) =>
      canAccess({
        user: session?.user ?? null,
        permission,
        context,
        policy,
      }),
    [policy, session?.user],
  );

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (!session?.tokens.refreshToken) return;
    void refresh();
  }, [refresh, session?.tokens.refreshToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.tokens.accessToken),
      isInitializing,
      login,
      signUp,
      refresh,
      logout,
      authFetch,
      can,
      lastError,
      clearError: () => setLastError(null),
    }),
    [authFetch, can, isInitializing, lastError, login, logout, refresh, session, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within <AuthProvider>.');
  }
  return value;
}
