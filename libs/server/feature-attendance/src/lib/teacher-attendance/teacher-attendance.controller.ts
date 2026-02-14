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
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { ListTeacherAttendanceQueryDto } from './dto/list-teacher-attendance-query.dto';
import { TeacherAttendanceResponseDto } from './dto/teacher-attendance-response.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';
import { TeacherAttendanceService } from './teacher-attendance.service';

@ApiTags('teacher-attendance')
@ApiBearerAuth()
@Controller('teacher-attendance')
export class TeacherAttendanceController {
  constructor(private readonly teacherAttendanceService: TeacherAttendanceService) {}

  @ApiOperation({ summary: 'List teacher attendance entries in authenticated tenant' })
  @ApiOkResponse({ type: [TeacherAttendanceResponseDto] })
  @Scopes('attendance.teachers.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListTeacherAttendanceQueryDto) {
    return this.teacherAttendanceService.list(user, query);
  }

  @ApiOperation({ summary: 'Get teacher attendance entry by id' })
  @ApiOkResponse({ type: TeacherAttendanceResponseDto })
  @ApiNotFoundResponse({ description: 'Teacher attendance not found' })
  @Scopes('attendance.teachers.read')
  @Get(':teacherAttendanceId')
  findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('teacherAttendanceId') teacherAttendanceId: string,
  ) {
    return this.teacherAttendanceService.findById(user, teacherAttendanceId);
  }

  @ApiOperation({ summary: 'Create teacher attendance entry' })
  @ApiOkResponse({ type: TeacherAttendanceResponseDto })
  @ApiConflictResponse({ description: 'Teacher attendance duplicate for date' })
  @Scopes('attendance.teachers.write')
  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTeacherAttendanceDto,
  ) {
    return this.teacherAttendanceService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update teacher attendance entry' })
  @ApiOkResponse({ type: TeacherAttendanceResponseDto })
  @ApiNotFoundResponse({ description: 'Teacher attendance not found' })
  @Scopes('attendance.teachers.write')
  @Patch(':teacherAttendanceId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('teacherAttendanceId') teacherAttendanceId: string,
    @Body() dto: UpdateTeacherAttendanceDto,
  ) {
    return this.teacherAttendanceService.update(user, teacherAttendanceId, dto);
  }
}
