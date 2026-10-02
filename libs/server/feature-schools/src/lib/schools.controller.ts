import { CurrentUser, PlatformAdminGuard, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AssignSchoolAdminDto } from './dto/assign-school-admin.dto';
import { CampusResponseDto } from './dto/campus-response.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CreateCampusDto } from './dto/create-campus.dto';
import { ListAdminAssignmentsQueryDto } from './dto/list-admin-assignments-query.dto';
import { ListCampusesQueryDto } from './dto/list-campuses-query.dto';
import { ListSchoolsQueryDto } from './dto/list-schools-query.dto';
import { SchoolResponseDto } from './dto/school-response.dto';
import { SchoolReadinessResponseDto } from './dto/school-readiness-response.dto';
import { SchoolAdminAssignmentResponseDto } from './dto/school-admin-assignment-response.dto';
import { ProvisionSchoolDto } from './dto/provision-school.dto';
import { ProvisionSchoolResponseDto } from './dto/provision-school-response.dto';
import { PlatformProvisionSchoolDto } from './dto/platform-provision-school.dto';
import { PlatformSchoolResponseDto } from './dto/platform-school-response.dto';
import { PlatformTenantResponseDto } from './dto/platform-tenant-response.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolsService } from './schools.service';

@ApiTags('schools')
@ApiBearerAuth()
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @ApiOperation({ summary: 'List every institution visible to the platform administrator' })
  @ApiOkResponse({ type: [PlatformTenantResponseDto] })
  @UseGuards(PlatformAdminGuard)
  @Get('platform/tenants')
  listPlatformTenants() {
    return this.schoolsService.listPlatformTenants();
  }

  @ApiOperation({ summary: 'List every school across all institutions' })
  @ApiOkResponse({ type: [PlatformSchoolResponseDto] })
  @UseGuards(PlatformAdminGuard)
  @Get('platform/all')
  listPlatformSchools() {
    return this.schoolsService.listPlatformSchools();
  }

  @ApiOperation({ summary: 'Provision a school in any institution' })
  @ApiOkResponse({ type: ProvisionSchoolResponseDto })
  @UseGuards(PlatformAdminGuard)
  @Post('platform/provision')
  provisionPlatformSchool(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: PlatformProvisionSchoolDto,
  ) {
    return this.schoolsService.provisionPlatformSchool(user, dto);
  }

  @ApiOperation({ summary: 'List campuses in the authenticated tenant' })
  @ApiOkResponse({ type: [CampusResponseDto] })
  @Scopes('schools.read')
  @Get('campuses')
  listCampuses(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListCampusesQueryDto,
  ) {
    return this.schoolsService.listCampuses(user, query);
  }

  @ApiOperation({ summary: 'Get campus by id in authenticated tenant' })
  @ApiOkResponse({ type: CampusResponseDto })
  @ApiNotFoundResponse({ description: 'Campus not found' })
  @Scopes('schools.read')
  @Get('campuses/:campusId')
  findCampusById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('campusId') campusId: string,
  ) {
    return this.schoolsService.findCampusById(user, campusId);
  }

  @ApiOperation({ summary: 'Create campus in authenticated tenant' })
  @ApiOkResponse({ type: CampusResponseDto })
  @ApiConflictResponse({ description: 'Duplicate campus code in school' })
  @Scopes('schools.write')
  @Post('campuses')
  createCampus(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCampusDto,
  ) {
    return this.schoolsService.createCampus(user, dto);
  }

  @ApiOperation({ summary: 'Update campus metadata in authenticated tenant' })
  @ApiOkResponse({ type: CampusResponseDto })
  @ApiNotFoundResponse({ description: 'Campus not found' })
  @Scopes('schools.write')
  @Patch('campuses/:campusId')
  updateCampus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('campusId') campusId: string,
    @Body() dto: UpdateCampusDto,
  ) {
    return this.schoolsService.updateCampus(user, campusId, dto);
  }

  @ApiOperation({ summary: 'List tenant-admin to school assignments' })
  @ApiOkResponse({ type: [SchoolAdminAssignmentResponseDto] })
  @Scopes('schools.read')
  @Get('admin-assignments')
  listAdminAssignments(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListAdminAssignmentsQueryDto,
  ) {
    return this.schoolsService.listAdminAssignments(user, query);
  }

  @ApiOperation({ summary: 'Assign a tenant admin membership to a school' })
  @ApiOkResponse({ type: SchoolAdminAssignmentResponseDto })
  @ApiBadRequestResponse({ description: 'Membership does not have admin role' })
  @ApiNotFoundResponse({ description: 'School or membership not found' })
  @ApiForbiddenResponse({ description: 'Missing required scope(s)' })
  @Scopes('schools.write')
  @Post('admin-assignments')
  assignAdminToSchool(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AssignSchoolAdminDto,
  ) {
    return this.schoolsService.assignAdminToSchool(user, dto);
  }

  @ApiOperation({ summary: 'Revoke tenant-admin school assignment' })
  @ApiOkResponse({ type: SchoolAdminAssignmentResponseDto })
  @ApiNotFoundResponse({ description: 'School admin assignment not found' })
  @Scopes('schools.write')
  @Delete('admin-assignments/:assignmentId')
  revokeAdminAssignment(
    @CurrentUser() user: AuthenticatedUser,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.schoolsService.revokeAdminAssignment(user, assignmentId);
  }

  @ApiOperation({ summary: 'List schools in the authenticated tenant' })
  @ApiOkResponse({ type: [SchoolResponseDto] })
  @Scopes('schools.read')
  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListSchoolsQueryDto,
  ) {
    return this.schoolsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get school by id in authenticated tenant' })
  @ApiOkResponse({ type: SchoolResponseDto })
  @ApiNotFoundResponse({ description: 'School not found' })
  @Scopes('schools.read')
  @Get(':schoolId')
  findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('schoolId') schoolId: string,
  ) {
    return this.schoolsService.findById(user, schoolId);
  }

  @ApiOperation({ summary: 'Get operational readiness for a school' })
  @ApiOkResponse({ type: SchoolReadinessResponseDto })
  @ApiNotFoundResponse({ description: 'School not found' })
  @Scopes('schools.read')
  @Get(':schoolId/readiness')
  getReadiness(
    @CurrentUser() user: AuthenticatedUser,
    @Param('schoolId') schoolId: string,
  ) {
    return this.schoolsService.getReadiness(user, schoolId);
  }

  @ApiOperation({ summary: 'Create school in authenticated tenant' })
  @ApiOkResponse({ type: SchoolResponseDto })
  @ApiConflictResponse({ description: 'Duplicate school code' })
  @Scopes('schools.write')
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSchoolDto,
  ) {
    return this.schoolsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Provision a school, campus and school administrator' })
  @ApiOkResponse({ type: ProvisionSchoolResponseDto })
  @ApiConflictResponse({ description: 'School code already exists' })
  @Scopes('schools.write')
  @Post('provision')
  provision(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ProvisionSchoolDto,
  ) {
    return this.schoolsService.provision(user, dto);
  }

  @ApiOperation({ summary: 'Update school metadata in authenticated tenant' })
  @ApiOkResponse({ type: SchoolResponseDto })
  @ApiNotFoundResponse({ description: 'School not found' })
  @Scopes('schools.write')
  @Patch(':schoolId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('schoolId') schoolId: string,
    @Body() dto: UpdateSchoolDto,
  ) {
    return this.schoolsService.update(user, schoolId, dto);
  }
}
