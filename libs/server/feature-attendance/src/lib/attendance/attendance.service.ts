import { PrismaService } from '@gps/data-access-db';
import {
  AttendanceRecord,
  AttendanceSession,
  EnrollmentStatus,
  Prisma,
} from '@gps/data-access-prisma';
import { apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AttendanceRecordResponseDto } from './dto/attendance-record-response.dto';
import { AttendanceSessionResponseDto } from './dto/attendance-session-response.dto';
import { BulkUpsertAttendanceRecordsDto } from './dto/bulk-upsert-attendance-records.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { ListAttendanceRecordsQueryDto } from './dto/list-attendance-records-query.dto';
import { ListAttendanceSessionsQueryDto } from './dto/list-attendance-sessions-query.dto';
import { MarkAttendanceRecordsDto } from './dto/mark-attendance-records.dto';

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
        createdById: user.sub,
        updatedById: user.sub,
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
            createdById: user.sub,
            updatedById: user.sub,
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            markedAt: new Date(),
            updatedById: user.sub,
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

  async markSessionRecords(
    user: AuthenticatedUser,
    sessionId: string,
    dto: MarkAttendanceRecordsDto,
  ): Promise<AttendanceRecordResponseDto[]> {
    const session = await this.prisma.attendanceSession.findFirst({
      where: { id: sessionId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true, classRoomId: true },
    });

    if (!session) {
      throw apiNotFound('ATTENDANCE_SESSION_NOT_FOUND', 'Attendance session not found', {
        sessionId,
      });
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId: user.tenantId,
        classRoomId: session.classRoomId,
        status: EnrollmentStatus.ACTIVE,
        deletedAt: null,
        student: { deletedAt: null },
      },
      select: { studentId: true },
      orderBy: [{ createdAt: 'asc' }],
    });

    const allStudentIds = enrollments.map((e) => e.studentId);
    if (allStudentIds.length === 0) {
      return [];
    }

    const selectedIds = dto.studentIds?.length ? dto.studentIds : undefined;
    const selectedSet = selectedIds ? new Set(selectedIds) : undefined;
    const remainingStatus = dto.remainingStatus;
    if (selectedIds) {
      const allowed = new Set(allStudentIds);
      const invalid = selectedIds.filter((id) => !allowed.has(id));
      if (invalid.length > 0) {
        throw apiUnprocessable(
          'ATTENDANCE_STUDENT_NOT_IN_CLASS',
          'One or more students are not active in this class session',
          { invalidStudentIds: invalid },
        );
      }
    }

    const toMarkSelected = selectedIds ?? allStudentIds;
    const toMarkRemaining =
      selectedIds && remainingStatus && selectedSet
        ? allStudentIds.filter((id) => !selectedSet.has(id))
        : [];

    const now = new Date();

    const ops: Prisma.PrismaPromise<unknown>[] = toMarkSelected.map((studentId) =>
      this.prisma.attendanceRecord.upsert({
        where: {
          attendanceSessionId_studentId: {
            attendanceSessionId: sessionId,
            studentId,
          },
        },
        create: {
          tenantId: user.tenantId,
          attendanceSessionId: sessionId,
          studentId,
          status: dto.status,
          remarks: dto.remarks,
          markedAt: now,
          createdById: user.sub,
          updatedById: user.sub,
        },
        update: {
          status: dto.status,
          remarks: dto.remarks,
          markedAt: now,
          updatedById: user.sub,
        },
      }),
    );

    if (toMarkRemaining.length > 0 && remainingStatus) {
      ops.push(
        ...toMarkRemaining.map((studentId) =>
          this.prisma.attendanceRecord.upsert({
            where: {
              attendanceSessionId_studentId: {
                attendanceSessionId: sessionId,
                studentId,
              },
            },
            create: {
              tenantId: user.tenantId,
              attendanceSessionId: sessionId,
              studentId,
              status: remainingStatus,
              remarks: dto.remarks,
              markedAt: now,
              createdById: user.sub,
              updatedById: user.sub,
            },
            update: {
              status: remainingStatus,
              remarks: dto.remarks,
              markedAt: now,
              updatedById: user.sub,
            },
          }),
        ),
      );
    }

    await this.prisma.$transaction(ops);

    const rows = await this.prisma.attendanceRecord.findMany({
      where: { tenantId: user.tenantId, attendanceSessionId: sessionId, deletedAt: null },
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
