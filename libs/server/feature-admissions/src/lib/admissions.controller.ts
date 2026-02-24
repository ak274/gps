import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { EnrollAdmissionApplicationDto } from './dto/enroll-admission-application.dto';
import { AdmissionApplicationResponseDto } from './dto/admission-application-response.dto';
import { ListAdmissionApplicationsQueryDto } from './dto/list-admission-applications-query.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @ApiOperation({ summary: 'List admission applications in authenticated tenant' })
  @ApiOkResponse({ type: [AdmissionApplicationResponseDto] })
  @Scopes('admissions.read')
  @Get('applications')
  listApplications(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListAdmissionApplicationsQueryDto,
  ) {
    return this.admissionsService.listApplications(user, query);
  }

  @ApiOperation({ summary: 'Get admission application by id in authenticated tenant' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @ApiNotFoundResponse({ description: 'Admission application not found' })
  @Scopes('admissions.read')
  @Get('applications/:applicationId')
  findApplicationById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
  ) {
    return this.admissionsService.findApplicationById(user, applicationId);
  }

  @ApiOperation({ summary: 'Create admission application in authenticated tenant' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @Scopes('admissions.write')
  @Post('applications')
  createApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAdmissionApplicationDto,
  ) {
    return this.admissionsService.createApplication(user, dto);
  }

  @ApiOperation({ summary: 'Update admission application in authenticated tenant' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @ApiNotFoundResponse({ description: 'Admission application not found' })
  @Scopes('admissions.write')
  @Patch('applications/:applicationId')
  updateApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: UpdateAdmissionApplicationDto,
  ) {
    return this.admissionsService.updateApplication(user, applicationId, dto);
  }

  @ApiOperation({ summary: 'Enroll an admission application (creates student, guardians, and enrollment)' })
  @ApiOkResponse({ schema: { example: { success: true, studentId: '...' } } })
  @ApiNotFoundResponse({ description: 'Admission application not found' })
  @Scopes('admissions.write')
  @Post('applications/:applicationId/enroll')
  enroll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: EnrollAdmissionApplicationDto,
  ) {
    return this.admissionsService.enroll(user, applicationId, dto);
  }
}

