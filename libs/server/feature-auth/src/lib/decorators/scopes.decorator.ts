import { SetMetadata } from '@nestjs/common';
import { AUTH_SCOPES_KEY } from '../constants/auth.constants';

export const Scopes = (...scopes: string[]) =>
  SetMetadata(AUTH_SCOPES_KEY, scopes);

