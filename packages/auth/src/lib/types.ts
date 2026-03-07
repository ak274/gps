export type AuthUser = {
  sub: string;
  sid: string;
  email: string;
  tenantId: string;
  tenantCode: string;
  roles: string[];
  scopes: string[];
  attributes?: Record<string, unknown>;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: string;
  refreshExpiresIn: string;
};

export type AuthSession = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type LoginInput = {
  email: string;
  password: string;
  tenantCode?: string;
};

export type SignUpInput = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  tenantCode: string;
};

export type RefreshInput = {
  refreshToken: string;
};

export type LogoutInput = {
  refreshToken?: string;
};

export type AuthApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
};

export type AuthFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
