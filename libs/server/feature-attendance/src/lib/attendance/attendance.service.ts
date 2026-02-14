import { PrismaService } from '@gps/data-access-db';
import {
  AttendanceRecord,
  AttendanceSession,
  Prisma,
} from '@gps/data-access-prisma';
import { apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AttendanceRecordResponseDto } from './dto/attendance-record-response.dto';
import { AttendanceSessionResponseDto } from './dto/attendance-session-response.dto';
import { BulkUpsertAttendanceRecordsDto } from './dto/bulk-upsert-attendance-records.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { ListAttendanceRecordsQueryDto } from './dto/list-attendance-records-query.dto';
import { ListAttendanceSessionsQueryDto } from './dto/list-attendance-sessions-query.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async listSessions(
    user: AuthenticatedUser,
    query: ListAttendanceSessionsQueryDto,
  ): Promise<AttendanceSessionResponseDto[]> {
    const rows = await this.prisma.attendanceSession.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.classRoomId ? { classRoomId: query.classRoomId } : {}),
        ...(query.subjectId ? { subjectId: query.subjectId } : {}),
        ...(query.attendanceOn ? { attendanceOn: new Date(query.attendanceOn) } : {}),
      },
      orderBy: [{ attendanceOn: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map((row) => this.toSessionResponse(row));
  }

  async findSessionById(
    user: AuthenticatedUser,
    sessionId: string,
  ): Promise<AttendanceSessionResponseDto> {
    const row = await this.prisma.attendanceSession.findFirst({
      where: {
        id: sessionId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('ATTENDANCE_SESSION_NOT_FOUND', 'Attendance session not found', {
        sessionId,
      });
    }

    return this.toSessionResponse(row);
  }

  async createSession(
    user: AuthenticatedUser,
    dto: CreateAttendanceSessionDto,
  ): Promise<AttendanceSessionResponseDto> {
    const row = await this.prisma.attendanceSession.create({
      data: {
        tenantId: user.tenantId,
        classRoomId: dto.classRoomId,
        subjectId: dto.subjectId,
        periodNo: dto.periodNo,
        attendanceOn: new Date(dto.attendanceOn),
        markedByStaffId: dto.markedByStaffId,
      },
    });

    return this.toSessionResponse(row);
  }

  async bulkUpsertSessionRecords(
    user: AuthenticatedUser,
    sessionId: string,
    dto: BulkUpsertAttendanceRecordsDto,
  ): Promise<AttendanceRecordResponseDto[]> {
    const session = await this.prisma.attendanceSession.findFirst({
      where: {
        id: sessionId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!session) {
      throw apiNotFound('ATTENDANCE_SESSION_NOT_FOUND', 'Attendance session not found', {
        sessionId,
      });
    }

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.attendanceRecord.upsert({
          where: {
            attendanceSessionId_studentId: {
              attendanceSessionId: sessionId,
              studentId: record.studentId,
            },
          },
          create: {
            tenantId: user.tenantId,
            attendanceSessionId: sessionId,
            studentId: record.studentId,
            status: record.status,
            remarks: record.remarks,
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            markedAt: new Date(),
          },
        }),
      ),
    );

    const rows = await this.prisma.attendanceRecord.findMany({
      where: {
        tenantId: user.tenantId,
        attendanceSessionId: sessionId,
        deletedAt: null,
      },
      orderBy: [{ markedAt: 'desc' }],
    });

    return rows.map((row) => this.toRecordResponse(row));
  }

  async listRecords(
    user: AuthenticatedUser,
    query: ListAttendanceRecordsQueryDto,
  ): Promise<AttendanceRecordResponseDto[]> {
    const where: Prisma.AttendanceRecordWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.attendanceSessionId
        ? { attendanceSessionId: query.attendanceSessionId }
        : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.attendanceOn
        ? {
            attendanceSession: {
              attendanceOn: new Date(query.attendanceOn),
            },
          }
        : {}),
    };

    const rows = await this.prisma.attendanceRecord.findMany({
      where,
      orderBy: [{ markedAt: 'desc' }],
    });

    return rows.map((row) => this.toRecordResponse(row));
  }

  private toSessionResponse(row: AttendanceSession): AttendanceSessionResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      classRoomId: row.classRoomId,
      subjectId: row.subjectId,
      periodNo: row.periodNo,
      attendanceOn: row.attendanceOn.toISOString(),
      markedByStaffId: row.markedByStaffId,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private toRecordResponse(row: AttendanceRecord): AttendanceRecordResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      attendanceSessionId: row.attendanceSessionId,
      studentId: row.studentId,
      status: row.status,
      remarks: row.remarks,
      markedAt: row.markedAt.toISOString(),
    };
  }
}
