export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
  tenantId?: string;
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

