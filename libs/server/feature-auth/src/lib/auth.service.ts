import { randomBytes, createHash } from 'node:crypto';
import {
  MembershipStatus,
  UserStatus,
} from '@gps/data-access-prisma';
import { apiUnauthorized } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@gps/data-access-db';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthenticatedUser } from './interfaces/authenticated-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        memberships: {
          where: {
            status: MembershipStatus.ACTIVE,
            deletedAt: null,
          },
          include: {
            tenant: true,
            roleAssignments: {
              where: { deletedAt: null },
              include: {
                role: {
                  include: {
                    permissions: {
                      where: { deletedAt: null },
                      include: { permission: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE || !user.passwordHash) {
      throw apiUnauthorized('AUTH_INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw apiUnauthorized('AUTH_INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const membership =
      user.memberships.find((m) => m.tenant.code === dto.tenantCode) ??
      user.memberships[0];

    if (!membership) {
      throw apiUnauthorized(
        'AUTH_TENANT_MEMBERSHIP_NOT_FOUND',
        'No active tenant membership found for this user',
        { tenantCode: dto.tenantCode },
      );
    }

    const refreshToken = this.generateRefreshToken();
    const refreshExpiryDate = this.calculateExpiryDate(
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
    );

    const session = await this.prisma.session.create({
      data: {
        tenantId: membership.tenantId,
        userId: user.id,
        token: this.hashToken(refreshToken),
        expiresAt: refreshExpiryDate,
        lastUsedAt: new Date(),
      },
    });

    const payload = this.buildPayload({
      userId: user.id,
      email: user.email,
      tenantId: membership.tenantId,
      tenantCode: membership.tenant.code,
      sessionId: session.id,
      roleAssignments: membership.roleAssignments,
    });

    const accessToken = await this.jwt.signAsync(payload);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
      refreshExpiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      user: payload,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const now = new Date();
    const tokenHash = this.hashToken(dto.refreshToken);

    const session = await this.prisma.session.findFirst({
      where: {
        token: tokenHash,
        revokedAt: null,
        deletedAt: null,
        expiresAt: { gt: now },
      },
      include: {
        user: true,
        tenant: true,
      },
    });

    if (!session || session.user.status !== UserStatus.ACTIVE) {
      throw apiUnauthorized('AUTH_REFRESH_TOKEN_INVALID', 'Invalid or expired refresh token');
    }

    const membership = await this.prisma.userTenant.findFirst({
      where: {
        tenantId: session.tenantId,
        userId: session.userId,
        status: MembershipStatus.ACTIVE,
        deletedAt: null,
      },
      include: {
        tenant: true,
        roleAssignments: {
          where: { deletedAt: null },
          include: {
            role: {
              include: {
                permissions: {
                  where: { deletedAt: null },
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      throw apiUnauthorized(
        'AUTH_MEMBERSHIP_INACTIVE',
        'No active membership for this tenant',
        { tenantId: session.tenantId },
      );
    }

    const newRefreshToken = this.generateRefreshToken();
    const refreshExpiryDate = this.calculateExpiryDate(
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
    );

    const newSession = await this.prisma.$transaction(async (tx) => {
      await tx.session.update({
        where: { id: session.id },
        data: {
          revokedAt: now,
          lastUsedAt: now,
        },
      });

      return tx.session.create({
        data: {
          tenantId: session.tenantId,
          userId: session.userId,
          token: this.hashToken(newRefreshToken),
          expiresAt: refreshExpiryDate,
          lastUsedAt: now,
        },
      });
    });

    const payload = this.buildPayload({
      userId: session.userId,
      email: session.user.email,
      tenantId: session.tenantId,
      tenantCode: membership.tenant.code,
      sessionId: newSession.id,
      roleAssignments: membership.roleAssignments,
    });

    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
      refreshExpiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '30d'),
      user: payload,
    };
  }

  async logout(user: AuthenticatedUser, refreshToken?: string) {
    const now = new Date();
    const tokenHash = refreshToken ? this.hashToken(refreshToken) : undefined;

    await this.prisma.session.updateMany({
      where: {
        tenantId: user.tenantId,
        userId: user.sub,
        revokedAt: null,
        deletedAt: null,
        OR: [
          { id: user.sid },
          ...(tokenHash ? [{ token: tokenHash }] : []),
        ],
      },
      data: {
        revokedAt: now,
        lastUsedAt: now,
      },
    });

    return { success: true };
  }

  private buildPayload(params: {
    userId: string;
    sessionId: string;
    email: string;
    tenantId: string;
    tenantCode: string;
    roleAssignments: Array<{
      role: {
        key: string;
        permissions: Array<{ permission: { key: string } }>;
      };
    }>;
  }): AuthenticatedUser {
    const roles = params.roleAssignments.map((ra) => ra.role.key);
    const scopes = Array.from(
      new Set(
        params.roleAssignments.flatMap((ra) =>
          ra.role.permissions.map((rp) => rp.permission.key),
        ),
      ),
    );

    return {
      sub: params.userId,
      sid: params.sessionId,
      email: params.email,
      tenantId: params.tenantId,
      tenantCode: params.tenantCode,
      roles,
      scopes,
    };
  }

  private generateRefreshToken(): string {
    return randomBytes(48).toString('base64url');
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private calculateExpiryDate(duration: string): Date {
    const ms = this.durationToMs(duration);
    return new Date(Date.now() + ms);
  }

  private durationToMs(duration: string): number {
    const parsed = /^\s*(\d+)\s*([smhd])\s*$/i.exec(duration);
    if (!parsed) {
      return 30 * 24 * 60 * 60 * 1000;
    }

    const amount = Number(parsed[1]);
    const unit = parsed[2].toLowerCase();

    if (unit === 's') {
      return amount * 1000;
    }

    if (unit === 'm') {
      return amount * 60 * 1000;
    }

    if (unit === 'h') {
      return amount * 60 * 60 * 1000;
    }

    return amount * 24 * 60 * 60 * 1000;
  }
}
