import { PrismaService } from '@gps/data-access-db';
import { TimetableEntry } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { err, ok, type Result } from 'neverthrow';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto';
import { ListTimetableEntriesQueryDto } from './dto/list-timetable-entries-query.dto';
import { TimetableEntryResponseDto } from './dto/timetable-entry-response.dto';
import { UpdateTimetableEntryDto } from './dto/update-timetable-entry.dto';

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  async listEntries(user: AuthenticatedUser, query: ListTimetableEntriesQueryDto) {
    const rows = await this.prisma.timetableEntry.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.classRoomId ? { classRoomId: query.classRoomId } : {}),
        ...(query.teacherId ? { teacherId: query.teacherId } : {}),
        ...(query.dayOfWeek ? { dayOfWeek: query.dayOfWeek } : {}),
      },
      orderBy: [
        { schoolId: 'asc' },
        { classRoomId: 'asc' },
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findEntryById(user: AuthenticatedUser, entryId: string) {
    const row = await this.prisma.timetableEntry.findFirst({
      where: {
        id: entryId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('TIMETABLE_ENTRY_NOT_FOUND', 'Timetable entry not found', { entryId });
    }

    return this.toResponse(row);
  }

  async createEntry(user: AuthenticatedUser, dto: CreateTimetableEntryDto) {
    const parsedTimes = this.parseAndValidateTimeRange(dto.startTime, dto.endTime);
    if (parsedTimes.isErr()) {
      throw parsedTimes.error;
    }

    const classRoom = await this.prisma.classRoom.findFirst({
      where: {
        id: dto.classRoomId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: {
        id: true,
        schoolId: true,
      },
    });

    if (!classRoom) {
      throw apiNotFound('TIMETABLE_CLASSROOM_NOT_FOUND', 'Classroom not found', {
        classRoomId: dto.classRoomId,
      });
    }

    await this.ensureSubjectInScope(user.tenantId, dto.subjectId, classRoom.schoolId);
    if (dto.teacherId) {
      await this.ensureTeacherInScope(user.tenantId, dto.teacherId);
    }

    const conflicting = await this.prisma.timetableEntry.findFirst({
      where: {
        tenantId: user.tenantId,
        classRoomId: dto.classRoomId,
        dayOfWeek: dto.dayOfWeek,
        startTime: parsedTimes.value.startTime,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (conflicting) {
      throw apiConflict(
        'TIMETABLE_SLOT_CONFLICT',
        'Timetable conflict: class already has an entry at that day and time',
      );
    }

    const row = await this.prisma.timetableEntry.create({
      data: {
        tenantId: user.tenantId,
        schoolId: classRoom.schoolId,
        classRoomId: dto.classRoomId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        dayOfWeek: dto.dayOfWeek,
        startTime: parsedTimes.value.startTime,
        endTime: parsedTimes.value.endTime,
        location: dto.location,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toResponse(row);
  }

  async updateEntry(user: AuthenticatedUser, entryId: string, dto: UpdateTimetableEntryDto) {
    const existing = await this.prisma.timetableEntry.findFirst({
      where: {
        id: entryId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('TIMETABLE_ENTRY_NOT_FOUND', 'Timetable entry not found', { entryId });
    }

    const nextStart = dto.startTime ?? this.toTimeString(existing.startTime);
    const nextEnd = dto.endTime ?? this.toTimeString(existing.endTime);
    const parsedTimes = this.parseAndValidateTimeRange(nextStart, nextEnd);
    if (parsedTimes.isErr()) {
      throw parsedTimes.error;
    }

    if (dto.subjectId) {
      await this.ensureSubjectInScope(user.tenantId, dto.subjectId, existing.schoolId);
    }
    if (dto.teacherId) {
      await this.ensureTeacherInScope(user.tenantId, dto.teacherId);
    }

    const targetDayOfWeek = dto.dayOfWeek ?? existing.dayOfWeek;
    const conflicting = await this.prisma.timetableEntry.findFirst({
      where: {
        tenantId: user.tenantId,
        classRoomId: existing.classRoomId,
        dayOfWeek: targetDayOfWeek,
        startTime: parsedTimes.value.startTime,
        deletedAt: null,
        id: { not: entryId },
      },
      select: { id: true },
    });
    if (conflicting) {
      throw apiConflict(
        'TIMETABLE_SLOT_CONFLICT',
        'Timetable conflict: class already has an entry at that day and time',
      );
    }

    const row = await this.prisma.timetableEntry.update({
      where: { id: entryId },
      data: {
        ...(dto.subjectId !== undefined ? { subjectId: dto.subjectId } : {}),
        ...(dto.teacherId !== undefined ? { teacherId: dto.teacherId } : {}),
        ...(dto.dayOfWeek !== undefined ? { dayOfWeek: dto.dayOfWeek } : {}),
        ...(dto.startTime !== undefined ? { startTime: parsedTimes.value.startTime } : {}),
        ...(dto.endTime !== undefined ? { endTime: parsedTimes.value.endTime } : {}),
        ...(dto.location !== undefined ? { location: dto.location } : {}),
        updatedById: user.sub,
      },
    });

    return this.toResponse(row);
  }

  async deleteEntry(user: AuthenticatedUser, entryId: string) {
    const existing = await this.prisma.timetableEntry.findFirst({
      where: {
        id: entryId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!existing) {
      throw apiNotFound('TIMETABLE_ENTRY_NOT_FOUND', 'Timetable entry not found', { entryId });
    }

    await this.prisma.timetableEntry.update({
      where: { id: entryId },
      data: {
        deletedAt: new Date(),
        deletedById: user.sub,
        updatedById: user.sub,
      },
    });

    return { success: true };
  }

  private async ensureSubjectInScope(
    tenantId: string,
    subjectId: string,
    schoolId: string,
  ): Promise<void> {
    const subject = await this.prisma.subject.findFirst({
      where: {
        id: subjectId,
        tenantId,
        schoolId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!subject) {
      throw apiNotFound('TIMETABLE_SUBJECT_NOT_FOUND', 'Subject not found in this school', {
        subjectId,
        schoolId,
      });
    }
  }

  private async ensureTeacherInScope(tenantId: string, teacherId: string): Promise<void> {
    const teacher = await this.prisma.teacherProfile.findFirst({
      where: {
        id: teacherId,
        tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!teacher) {
      throw apiNotFound('TIMETABLE_TEACHER_NOT_FOUND', 'Teacher not found', { teacherId });
    }
  }

  private parseTime(value: string): Result<Date, UnprocessableEntityException> {
    const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
    if (!match) {
      return err(
        apiUnprocessable('TIMETABLE_TIME_FORMAT_INVALID', 'Time must be HH:mm or HH:mm:ss'),
      );
    }

    const [, hh, mm, ss = '00'] = match;
    return ok(new Date(Date.UTC(1970, 0, 1, Number(hh), Number(mm), Number(ss))));
  }

  private parseAndValidateTimeRange(
    startTime: string,
    endTime: string,
  ): Result<{ startTime: Date; endTime: Date }, UnprocessableEntityException> {
    const parsedStart = this.parseTime(startTime);
    if (parsedStart.isErr()) {
      return err(parsedStart.error);
    }

    const parsedEnd = this.parseTime(endTime);
    if (parsedEnd.isErr()) {
      return err(parsedEnd.error);
    }

    if (parsedEnd.value <= parsedStart.value) {
      return err(
        apiUnprocessable('TIMETABLE_TIME_RANGE_INVALID', 'endTime must be after startTime'),
      );
    }

    return ok({
      startTime: parsedStart.value,
      endTime: parsedEnd.value,
    });
  }

  private toTimeString(value: Date): string {
    return value.toISOString().slice(11, 19);
  }

  private toResponse(row: TimetableEntry): TimetableEntryResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      classRoomId: row.classRoomId,
      subjectId: row.subjectId,
      teacherId: row.teacherId,
      dayOfWeek: row.dayOfWeek,
      startTime: this.toTimeString(row.startTime),
      endTime: this.toTimeString(row.endTime),
      location: row.location,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
