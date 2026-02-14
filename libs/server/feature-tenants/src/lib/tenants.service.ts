import { Tenant } from '@gps/data-access-prisma';
import { PrismaService } from '@gps/data-access-db';
import { apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { UpdateCurrentTenantDto } from './dto/update-current-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrent(user: AuthenticatedUser): Promise<TenantResponseDto> {
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: user.tenantId,
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw apiNotFound('TENANT_NOT_FOUND', 'Tenant not found', { tenantId: user.tenantId });
    }

    return this.toResponse(tenant);
  }

  async updateCurrent(
    user: AuthenticatedUser,
    dto: UpdateCurrentTenantDto,
  ): Promise<TenantResponseDto> {
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        id: user.tenantId,
        deletedAt: null,
      },
    });

    if (!tenant) {
      throw apiNotFound('TENANT_NOT_FOUND', 'Tenant not found', { tenantId: user.tenantId });
    }

    const updated = await this.prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.timeZone !== undefined ? { timeZone: dto.timeZone } : {}),
        ...(dto.countryCode !== undefined ? { countryCode: dto.countryCode } : {}),
      },
    });

    return this.toResponse(updated);
  }

  private toResponse(tenant: Tenant): TenantResponseDto {
    return {
      id: tenant.id,
      code: tenant.code,
      name: tenant.name,
      status: tenant.status,
      timeZone: tenant.timeZone,
      countryCode: tenant.countryCode,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }
}
