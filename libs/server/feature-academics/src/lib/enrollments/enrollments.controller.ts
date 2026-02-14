import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
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
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { ListEnrollmentsQueryDto } from './dto/list-enrollments-query.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiOperation({ summary: 'List enrollments in authenticated tenant' })
  @ApiOkResponse({ type: [EnrollmentResponseDto] })
  @Scopes('enrollments.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListEnrollmentsQueryDto) {
    return this.enrollmentsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get enrollment by id in authenticated tenant' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @Scopes('enrollments.read')
  @Get(':enrollmentId')
  findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('enrollmentId') enrollmentId: string,
  ) {
    return this.enrollmentsService.findById(user, enrollmentId);
  }

  @ApiOperation({ summary: 'Create enrollment in authenticated tenant' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  @ApiConflictResponse({ description: 'Duplicate student enrollment for academic year' })
  @Scopes('enrollments.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update enrollment status/date in authenticated tenant' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  @ApiNotFoundResponse({ description: 'Enrollment not found' })
  @Scopes('enrollments.write')
  @Patch(':enrollmentId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(user, enrollmentId, dto);
  }
}
