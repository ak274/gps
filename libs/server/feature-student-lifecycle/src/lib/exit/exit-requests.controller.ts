import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { ExitRequestsService } from './exit-requests.service';
import { CreateExitRequestDto } from './dto/create-exit-request.dto';
import { ExitRequestResponseDto } from './dto/exit-request-response.dto';
import { ApproveExitRequestDto } from './dto/approve-exit-request.dto';
import { RejectExitRequestDto } from './dto/reject-exit-request.dto';

@ApiTags('student-lifecycle')
@ApiBearerAuth()
@Controller('lifecycle/exit-requests')
export class ExitRequestsController {
  constructor(private readonly exitRequestsService: ExitRequestsService) {}

  @ApiOperation({ summary: 'Create an exit/transfer request (parent portal)' })
  @ApiOkResponse({ type: ExitRequestResponseDto })
  @Scopes('students.exit.request')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateExitRequestDto) {
    return this.exitRequestsService.create(user, dto);
  }

  @ApiOperation({ summary: 'List exit/transfer requests in authenticated tenant' })
  @ApiOkResponse({ type: [ExitRequestResponseDto] })
  @Scopes('students.exit.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query('schoolId') schoolId?: string) {
    return this.exitRequestsService.list(user, schoolId);
  }

  @ApiOperation({ summary: 'Get exit/transfer request by id' })
  @ApiOkResponse({ type: ExitRequestResponseDto })
  @ApiNotFoundResponse({ description: 'Exit request not found' })
  @Scopes('students.exit.read')
  @Get(':exitRequestId')
  findById(@CurrentUser() user: AuthenticatedUser, @Param('exitRequestId') exitRequestId: string) {
    return this.exitRequestsService.findById(user, exitRequestId);
  }

  @ApiOperation({ summary: 'Approve an exit/transfer request (principal/admin)' })
  @ApiOkResponse({ type: ExitRequestResponseDto })
  @ApiNotFoundResponse({ description: 'Exit request not found' })
  @Scopes('students.exit.approve')
  @Post(':exitRequestId/approve')
  approve(
    @CurrentUser() user: AuthenticatedUser,
    @Param('exitRequestId') exitRequestId: string,
    @Body() dto: ApproveExitRequestDto,
  ) {
    return this.exitRequestsService.approve(user, exitRequestId, dto);
  }

  @ApiOperation({ summary: 'Reject an exit/transfer request (principal/admin)' })
  @ApiOkResponse({ type: ExitRequestResponseDto })
  @ApiNotFoundResponse({ description: 'Exit request not found' })
  @Scopes('students.exit.approve')
  @Post(':exitRequestId/reject')
  reject(
    @CurrentUser() user: AuthenticatedUser,
    @Param('exitRequestId') exitRequestId: string,
    @Body() dto: RejectExitRequestDto,
  ) {
    return this.exitRequestsService.reject(user, exitRequestId, dto);
  }

  @ApiOperation({ summary: 'Complete an approved exit request (updates enrollment + student status)' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Exit request not found' })
  @Scopes('students.exit.approve')
  @Post(':exitRequestId/complete')
  complete(@CurrentUser() user: AuthenticatedUser, @Param('exitRequestId') exitRequestId: string) {
    return this.exitRequestsService.complete(user, exitRequestId);
  }

  @ApiOperation({ summary: 'Get transfer/leaving certificate payload (JSON)' })
  @ApiOkResponse({ schema: { example: { exitRequestId: '...', certificate: { studentId: '...', reason: 'TRANSFER' } } } })
  @ApiNotFoundResponse({ description: 'Exit request not found' })
  @Scopes('students.exit.read')
  @Get(':exitRequestId/certificate')
  certificate(@CurrentUser() user: AuthenticatedUser, @Param('exitRequestId') exitRequestId: string) {
    return this.exitRequestsService.certificate(user, exitRequestId);
  }
}

