export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
  tenantId?: string;
  tenantCode?: string;
  isPlatformAdmin?: boolean;
  roles?: string[];
  scopes?: string[];
  schoolId?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthState = {
  tokens: AuthTokens | null;
  user: AuthUser | null;
};
