import { PrismaService } from '@gps/data-access-db';
import {
  Prisma,
  TeacherAttendance,
} from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateTeacherAttendanceDto } from './dto/create-teacher-attendance.dto';
import { ListTeacherAttendanceQueryDto } from './dto/list-teacher-attendance-query.dto';
import { TeacherAttendanceResponseDto } from './dto/teacher-attendance-response.dto';
import { UpdateTeacherAttendanceDto } from './dto/update-teacher-attendance.dto';

@Injectable()
export class TeacherAttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    user: AuthenticatedUser,
    query: ListTeacherAttendanceQueryDto,
  ): Promise<TeacherAttendanceResponseDto[]> {
    const where: Prisma.TeacherAttendanceWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.schoolId ? { schoolId: query.schoolId } : {}),
      ...(query.teacherId ? { teacherId: query.teacherId } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.attendanceOn ? { attendanceOn: new Date(query.attendanceOn) } : {}),
    };

    const rows = await this.prisma.teacherAttendance.findMany({
      where,
      orderBy: [{ attendanceOn: 'desc' }, { markedAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(
    user: AuthenticatedUser,
    teacherAttendanceId: string,
  ): Promise<TeacherAttendanceResponseDto> {
    const row = await this.prisma.teacherAttendance.findFirst({
      where: {
        id: teacherAttendanceId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('TEACHER_ATTENDANCE_NOT_FOUND', 'Teacher attendance not found', {
        teacherAttendanceId,
      });
    }

    return this.toResponse(row);
  }

  async create(
    user: AuthenticatedUser,
    dto: CreateTeacherAttendanceDto,
  ): Promise<TeacherAttendanceResponseDto> {
    const existing = await this.prisma.teacherAttendance.findFirst({
      where: {
        tenantId: user.tenantId,
        teacherId: dto.teacherId,
        attendanceOn: new Date(dto.attendanceOn),
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existing) {
      throw apiConflict(
        'TEACHER_ATTENDANCE_CONFLICT',
        'Teacher attendance already exists for this date',
        {
          teacherId: dto.teacherId,
          attendanceOn: dto.attendanceOn,
        },
      );
    }

    const row = await this.prisma.teacherAttendance.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        teacherId: dto.teacherId,
        attendanceOn: new Date(dto.attendanceOn),
        status: dto.status,
        remarks: dto.remarks,
      },
    });

    return this.toResponse(row);
  }

  async update(
    user: AuthenticatedUser,
    teacherAttendanceId: string,
    dto: UpdateTeacherAttendanceDto,
  ): Promise<TeacherAttendanceResponseDto> {
    const existing = await this.prisma.teacherAttendance.findFirst({
      where: {
        id: teacherAttendanceId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('TEACHER_ATTENDANCE_NOT_FOUND', 'Teacher attendance not found', {
        teacherAttendanceId,
      });
    }

    const row = await this.prisma.teacherAttendance.update({
      where: { id: teacherAttendanceId },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.remarks !== undefined ? { remarks: dto.remarks } : {}),
      },
    });

    return this.toResponse(row);
  }

  private toResponse(row: TeacherAttendance): TeacherAttendanceResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      teacherId: row.teacherId,
      attendanceOn: row.attendanceOn.toISOString(),
      status: row.status,
      remarks: row.remarks,
      markedAt: row.markedAt.toISOString(),
    };
  }
}
