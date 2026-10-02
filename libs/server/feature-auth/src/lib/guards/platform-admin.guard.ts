import { apiForbidden } from '@gps/server-errors';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class PlatformAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    if (request.user?.isPlatformAdmin) return true;

    throw apiForbidden(
      'AUTH_PLATFORM_ADMIN_REQUIRED',
      'Platform administrator access is required for this operation',
    );
  }
}
