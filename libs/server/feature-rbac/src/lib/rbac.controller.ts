import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateRoleDto } from './dto/create-role.dto';
import { ListRolesQueryDto } from './dto/list-roles-query.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { ReplaceRolePermissionsDto } from './dto/replace-role-permissions.dto';
import { ReplaceUserTenantRolesDto } from './dto/replace-user-tenant-roles.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserRoleAssignmentResponseDto } from './dto/user-role-assignment-response.dto';
import { RbacService } from './rbac.service';

@ApiTags('rbac')
@ApiBearerAuth()
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @ApiOperation({ summary: 'List permission catalog' })
  @ApiOkResponse({ type: [PermissionResponseDto] })
  @Scopes('rbac.permissions.read')
  @Get('permissions')
  listPermissions() {
    return this.rbacService.listPermissions();
  }

  @ApiOperation({ summary: 'List roles for authenticated tenant' })
  @ApiOkResponse({ type: [RoleResponseDto] })
  @Scopes('rbac.roles.read')
  @Get('roles')
  listRoles(@CurrentUser() user: AuthenticatedUser, @Query() query: ListRolesQueryDto) {
    return this.rbacService.listRoles(user, query);
  }

  @ApiOperation({ summary: 'Get role by id' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @Scopes('rbac.roles.read')
  @Get('roles/:roleId')
  findRoleById(@CurrentUser() user: AuthenticatedUser, @Param('roleId') roleId: string) {
    return this.rbacService.findRoleById(user, roleId);
  }

  @ApiOperation({ summary: 'Create role in authenticated tenant' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiConflictResponse({ description: 'Role key conflict in tenant' })
  @Scopes('rbac.roles.write')
  @Post('roles')
  createRole(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(user, dto);
  }

  @ApiOperation({ summary: 'Update role metadata' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @Scopes('rbac.roles.write')
  @Patch('roles/:roleId')
  updateRole(
    @CurrentUser() user: AuthenticatedUser,
    @Param('roleId') roleId: string,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rbacService.updateRole(user, roleId, dto);
  }

  @ApiOperation({ summary: 'Replace role permissions by permission keys' })
  @ApiOkResponse({ type: RoleResponseDto })
  @ApiNotFoundResponse({ description: 'Role not found' })
  @Scopes('rbac.roles.write')
  @Put('roles/:roleId/permissions')
  replaceRolePermissions(
    @CurrentUser() user: AuthenticatedUser,
    @Param('roleId') roleId: string,
    @Body() dto: ReplaceRolePermissionsDto,
  ) {
    return this.rbacService.replaceRolePermissions(user, roleId, dto);
  }

  @ApiOperation({ summary: 'Get role assignments for a tenant membership' })
  @ApiOkResponse({ type: UserRoleAssignmentResponseDto })
  @ApiNotFoundResponse({ description: 'User tenant membership not found' })
  @Scopes('rbac.assignments.read')
  @Get('user-tenants/:userTenantId/roles')
  getUserTenantRoles(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userTenantId') userTenantId: string,
  ) {
    return this.rbacService.getUserTenantRoles(user, userTenantId);
  }

  @ApiOperation({ summary: 'Replace role assignments for a tenant membership' })
  @ApiOkResponse({ type: UserRoleAssignmentResponseDto })
  @ApiNotFoundResponse({ description: 'User tenant membership not found' })
  @Scopes('rbac.assignments.write')
  @Put('user-tenants/:userTenantId/roles')
  replaceUserTenantRoles(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userTenantId') userTenantId: string,
    @Body() dto: ReplaceUserTenantRolesDto,
  ) {
    return this.rbacService.replaceUserTenantRoles(user, userTenantId, dto);
  }
}
