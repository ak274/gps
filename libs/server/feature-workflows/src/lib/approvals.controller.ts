import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { ApprovalsService } from './approvals.service';
import { ApprovalResponseDto } from './dto/approval-response.dto';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { DecideApprovalDto } from './dto/decide-approval.dto';

@ApiTags('workflows')
@ApiBearerAuth()
@Controller('approvals')
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @ApiOperation({ summary: 'List approval requests' })
  @ApiOkResponse({ type: [ApprovalResponseDto] })
  @Scopes('workflows.approvals.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query('schoolId') schoolId?: string) { return this.approvalsService.list(user, schoolId); }

  @ApiOperation({ summary: 'Read an approval request' })
  @ApiOkResponse({ type: ApprovalResponseDto })
  @Scopes('workflows.approvals.read')
  @Get(':requestId')
  get(@CurrentUser() user: AuthenticatedUser, @Param('requestId') requestId: string) { return this.approvalsService.getById(user, requestId); }

  @ApiOperation({ summary: 'Create an ordered approval request' })
  @ApiOkResponse({ type: ApprovalResponseDto })
  @Scopes('workflows.approvals.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateApprovalRequestDto) { return this.approvalsService.create(user, dto); }

  @ApiOperation({ summary: 'Approve, reject or request changes' })
  @ApiOkResponse({ type: ApprovalResponseDto })
  @Scopes('workflows.approvals.decide')
  @Post(':requestId/decision')
  decide(@CurrentUser() user: AuthenticatedUser, @Param('requestId') requestId: string, @Body() dto: DecideApprovalDto) { return this.approvalsService.decide(user, requestId, dto); }
}
