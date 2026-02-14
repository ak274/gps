import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AttendanceService } from './attendance.service';
import { AttendanceRecordResponseDto } from './dto/attendance-record-response.dto';
import { AttendanceSessionResponseDto } from './dto/attendance-session-response.dto';
import { BulkUpsertAttendanceRecordsDto } from './dto/bulk-upsert-attendance-records.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { ListAttendanceRecordsQueryDto } from './dto/list-attendance-records-query.dto';
import { ListAttendanceSessionsQueryDto } from './dto/list-attendance-sessions-query.dto';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'List attendance sessions in authenticated tenant' })
  @ApiOkResponse({ type: [AttendanceSessionResponseDto] })
  @Scopes('attendance.sessions.read')
  @Get('sessions')
  listSessions(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListAttendanceSessionsQueryDto,
  ) {
    return this.attendanceService.listSessions(user, query);
  }

  @ApiOperation({ summary: 'Get attendance session by id' })
  @ApiOkResponse({ type: AttendanceSessionResponseDto })
  @ApiNotFoundResponse({ description: 'Attendance session not found' })
  @Scopes('attendance.sessions.read')
  @Get('sessions/:sessionId')
  findSessionById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
  ) {
    return this.attendanceService.findSessionById(user, sessionId);
  }

  @ApiOperation({ summary: 'Create attendance session' })
  @ApiOkResponse({ type: AttendanceSessionResponseDto })
  @Scopes('attendance.sessions.write')
  @Post('sessions')
  createSession(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAttendanceSessionDto,
  ) {
    return this.attendanceService.createSession(user, dto);
  }

  @ApiOperation({ summary: 'Bulk upsert attendance records for a session' })
  @ApiOkResponse({ type: [AttendanceRecordResponseDto] })
  @ApiNotFoundResponse({ description: 'Attendance session not found' })
  @Scopes('attendance.records.write')
  @Post('sessions/:sessionId/records:bulk-upsert')
  bulkUpsertSessionRecords(
    @CurrentUser() user: AuthenticatedUser,
    @Param('sessionId') sessionId: string,
    @Body() dto: BulkUpsertAttendanceRecordsDto,
  ) {
    return this.attendanceService.bulkUpsertSessionRecords(user, sessionId, dto);
  }

  @ApiOperation({ summary: 'List attendance records in authenticated tenant' })
  @ApiOkResponse({ type: [AttendanceRecordResponseDto] })
  @Scopes('attendance.records.read')
  @Get('records')
  listRecords(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListAttendanceRecordsQueryDto,
  ) {
    return this.attendanceService.listRecords(user, query);
  }
}
