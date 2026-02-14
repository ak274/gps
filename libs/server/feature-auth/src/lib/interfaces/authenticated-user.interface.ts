export interface AuthenticatedUser {
  sub: string;
  sid: string;
  email: string;
  tenantId: string;
  tenantCode: string;
  roles: string[];
  scopes: string[];
}
