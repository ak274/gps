export interface AuthenticatedUser {
  sub: string;
  sid: string;
  email: string;
  tenantId: string;
  tenantCode: string;
  isPlatformAdmin: boolean;
  roles: string[];
  scopes: string[];
}
