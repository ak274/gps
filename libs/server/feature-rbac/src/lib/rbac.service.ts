import { PrismaService } from '@gps/data-access-db';
import {
  Permission,
  Role,
} from '@gps/data-access-prisma';
import {
  apiBadRequest,
  apiConflict,
  apiNotFound,
} from '@gps/server-errors';
import {
  Injectable,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateRoleDto } from './dto/create-role.dto';
import { ListRolesQueryDto } from './dto/list-roles-query.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { ReplaceRolePermissionsDto } from './dto/replace-role-permissions.dto';
import { ReplaceUserTenantRolesDto } from './dto/replace-user-tenant-roles.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRoleAssignmentResponseDto } from './dto/user-role-assignment-response.dto';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async listPermissions(): Promise<PermissionResponseDto[]> {
    const rows = await this.prisma.permission.findMany({
      where: { deletedAt: null },
      orderBy: [{ key: 'asc' }],
    });

    return rows.map((row) => this.toPermissionResponse(row));
  }

  async listRoles(user: AuthenticatedUser, query: ListRolesQueryDto): Promise<RoleResponseDto[]> {
    const rows = await this.prisma.role.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.search
          ? {
              OR: [
                { key: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        permissions: {
          where: { deletedAt: null },
          include: { permission: true },
        },
      },
      orderBy: [{ key: 'asc' }],
    });

    return rows.map((row) => this.toRoleResponse(row));
  }

  async findRoleById(user: AuthenticatedUser, roleId: string): Promise<RoleResponseDto> {
    const row = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: { deletedAt: null },
          include: { permission: true },
        },
      },
    });

    if (!row) throw apiNotFound('RBAC_ROLE_NOT_FOUND', 'Role not found', { roleId });

    return this.toRoleResponse(row);
  }

  async createRole(user: AuthenticatedUser, dto: CreateRoleDto): Promise<RoleResponseDto> {
    const duplicate = await this.prisma.role.findFirst({
      where: {
        tenantId: user.tenantId,
        key: dto.key,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (duplicate)
      throw apiConflict('RBAC_ROLE_KEY_CONFLICT', 'Role key already exists in tenant', {
        roleKey: dto.key,
      });

    const row = await this.prisma.role.create({
      data: {
        tenantId: user.tenantId,
        key: dto.key,
        name: dto.name,
        description: dto.description,
        isSystem: dto.isSystem ?? false,
      },
      include: {
        permissions: {
          where: { deletedAt: null },
          include: { permission: true },
        },
      },
    });

    return this.toRoleResponse(row);
  }

  async updateRole(
    user: AuthenticatedUser,
    roleId: string,
    dto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    await this.ensureRole(user, roleId);

    const row = await this.prisma.role.update({
      where: { id: roleId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.isSystem !== undefined ? { isSystem: dto.isSystem } : {}),
      },
      include: {
        permissions: {
          where: { deletedAt: null },
          include: { permission: true },
        },
      },
    });

    return this.toRoleResponse(row);
  }

  async replaceRolePermissions(
    user: AuthenticatedUser,
    roleId: string,
    dto: ReplaceRolePermissionsDto,
  ): Promise<RoleResponseDto> {
    const role = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!role) throw apiNotFound('RBAC_ROLE_NOT_FOUND', 'Role not found', { roleId });

    const permissions = await this.prisma.permission.findMany({
      where: {
        key: { in: dto.permissionKeys },
        deletedAt: null,
      },
      select: { id: true, key: true },
    });

    const existingKeys = new Set(permissions.map((p) => p.key));
    const missing = dto.permissionKeys.filter((k) => !existingKeys.has(k));
    if (missing.length > 0) {
      throw apiBadRequest('RBAC_PERMISSION_KEYS_INVALID', 'Unknown permission keys', {
        missing,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: {
          roleId,
          deletedAt: null,
        },
      });

      if (permissions.length > 0) {
        await tx.rolePermission.createMany({
          data: permissions.map((permission) => ({
            roleId,
            permissionId: permission.id,
          })),
          skipDuplicates: true,
        });
      }
    });

    return this.findRoleById(user, roleId);
  }

  async getUserTenantRoles(
    user: AuthenticatedUser,
    userTenantId: string,
  ): Promise<UserRoleAssignmentResponseDto> {
    const userTenant = await this.prisma.userTenant.findFirst({
      where: {
        id: userTenantId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      include: {
        roleAssignments: {
          where: { deletedAt: null },
          include: { role: true },
        },
      },
    });

    if (!userTenant) {
      throw apiNotFound('RBAC_MEMBERSHIP_NOT_FOUND', 'User tenant membership not found', {
        userTenantId,
      });
    }

    return {
      userTenantId,
      roleKeys: userTenant.roleAssignments.map((assignment) => assignment.role.key),
    };
  }

  async replaceUserTenantRoles(
    user: AuthenticatedUser,
    userTenantId: string,
    dto: ReplaceUserTenantRolesDto,
  ): Promise<UserRoleAssignmentResponseDto> {
    const membership = await this.prisma.userTenant.findFirst({
      where: {
        id: userTenantId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!membership) {
      throw apiNotFound('RBAC_MEMBERSHIP_NOT_FOUND', 'User tenant membership not found', {
        userTenantId,
      });
    }

    const roles = await this.prisma.role.findMany({
      where: {
        tenantId: user.tenantId,
        key: { in: dto.roleKeys },
        deletedAt: null,
      },
      select: { id: true, key: true },
    });

    const existingKeys = new Set(roles.map((role) => role.key));
    const missing = dto.roleKeys.filter((k) => !existingKeys.has(k));
    if (missing.length > 0) {
      throw apiBadRequest('RBAC_ROLE_KEYS_INVALID', 'Unknown role keys for tenant', {
        missing,
      });
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.userRoleAssignment.deleteMany({
        where: {
          userTenantId,
          deletedAt: null,
        },
      });

      if (roles.length > 0) {
        await tx.userRoleAssignment.createMany({
          data: roles.map((role) => ({
            userTenantId,
            roleId: role.id,
          })),
          skipDuplicates: true,
        });
      }
    });

    return this.getUserTenantRoles(user, userTenantId);
  }

  private async ensureRole(user: AuthenticatedUser, roleId: string) {
    const exists = await this.prisma.role.findFirst({
      where: {
        id: roleId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!exists) {
      throw apiNotFound('RBAC_ROLE_NOT_FOUND', 'Role not found', { roleId });
    }
  }

  private toPermissionResponse(permission: Permission): PermissionResponseDto {
    return {
      id: permission.id,
      key: permission.key,
      name: permission.name,
      description: permission.description,
    };
  }

  private toRoleResponse(
    row: Role & {
      permissions: Array<{ permission: { key: string } }>;
    },
  ): RoleResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      key: row.key,
      name: row.name,
      description: row.description,
      isSystem: row.isSystem,
      permissionKeys: row.permissions.map((rp) => rp.permission.key).sort(),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
