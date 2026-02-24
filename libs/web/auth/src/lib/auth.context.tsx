import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { readTokens, writeTokens } from './token-store';
import type { AuthState, AuthTokens, AuthUser } from './auth.types';

export type AuthContextValue = {
  state: AuthState;
  setTokens: (tokens: AuthTokens | null) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokensState] = useState<AuthTokens | null>(() => {
    // SSR isn't expected in this app, but this keeps it safe if we add it later.
    if (typeof window === 'undefined') return null;
    return readTokens();
  });
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(() => {
    const setTokens = (next: AuthTokens | null) => {
      setTokensState(next);
      writeTokens(next);
    };

    const logout = () => {
      setTokens(null);
      setUser(null);
    };

    return {
      state: { tokens, user },
      setTokens,
      setUser,
      logout,
    };
  }, [tokens, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>.');
  return ctx;
}
