import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'dev-only-secret'),
      issuer: configService.get<string>('JWT_ISSUER', 'gps-api'),
      audience: configService.get<string>('JWT_AUDIENCE', 'gps-clients'),
    });
  }

  validate(payload: AuthenticatedUser): AuthenticatedUser {
    return payload;
  }
}

