import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsQueryDto } from './dto/list-schools-query.dto';
import { SchoolResponseDto } from './dto/school-response.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolsService } from './schools.service';

@ApiTags('schools')
@ApiBearerAuth()
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

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
