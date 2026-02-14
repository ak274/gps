import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { UpdateCurrentTenantDto } from './dto/update-current-tenant.dto';
import { TenantsService } from './tenants.service';

@ApiTags('tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @ApiOperation({ summary: 'Get current tenant from authenticated JWT context' })
  @ApiOkResponse({ type: TenantResponseDto })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @Scopes('tenants.read')
  @Get('current')
  getCurrent(@CurrentUser() user: AuthenticatedUser) {
    return this.tenantsService.getCurrent(user);
  }

  @ApiOperation({ summary: 'Update current tenant metadata' })
  @ApiOkResponse({ type: TenantResponseDto })
  @ApiNotFoundResponse({ description: 'Tenant not found' })
  @Scopes('tenants.write')
  @Patch('current')
  updateCurrent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateCurrentTenantDto,
  ) {
    return this.tenantsService.updateCurrent(user, dto);
  }
}
