import { apiForbidden } from '@gps/server-errors';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_SCOPES_KEY } from '../constants/auth.constants';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(
      AUTH_SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
    if (req.user?.isPlatformAdmin) return true;
    const userScopes = req.user?.scopes ?? [];
    const allowed = requiredScopes.every((scope) => userScopes.includes(scope));

    if (!allowed) {
      throw apiForbidden('AUTH_SCOPE_MISSING', 'Missing required scope(s)', {
        requiredScopes,
      });
    }

    return true;
  }
}
