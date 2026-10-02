import { PrismaService } from '@gps/data-access-db';
import { apiBadRequest, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateClassroomSubjectDto } from './dto/create-classroom-subject.dto';
import { ClassroomSubjectResponseDto } from './dto/classroom-subject-response.dto';
import { ListClassroomSubjectsQueryDto } from './dto/list-classroom-subjects-query.dto';

@Injectable()
export class ClassroomSubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    user: AuthenticatedUser,
    query: ListClassroomSubjectsQueryDto,
  ): Promise<ClassroomSubjectResponseDto[]> {
    const rows = await this.prisma.classroomSubject.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.classRoomId ? { classRoomId: query.classRoomId } : {}),
        classRoom: {
          ...(query.schoolId ? { schoolId: query.schoolId } : {}),
          ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
          deletedAt: null,
        },
      },
      include: {
        classRoom: { select: { name: true, section: true } },
        subject: { select: { code: true, name: true } },
        teacher: { include: { staffProfile: { include: { user: { select: { firstName: true, lastName: true } } } } } },
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    return rows.map((row) => ({
      id: row.id,
      classRoomId: row.classRoomId,
      className: row.classRoom.name,
      section: row.classRoom.section,
      subjectId: row.subjectId,
      subjectCode: row.subject.code,
      subjectName: row.subject.name,
      teacherId: row.teacherId,
      teacherName: row.teacher
        ? [row.teacher.staffProfile.user.firstName, row.teacher.staffProfile.user.lastName]
            .filter(Boolean)
            .join(' ')
        : null,
    }));
  }

  async assign(user: AuthenticatedUser, dto: CreateClassroomSubjectDto) {
    const [classRoom, subject] = await Promise.all([
      this.prisma.classRoom.findFirst({
        where: { id: dto.classRoomId, tenantId: user.tenantId, deletedAt: null },
        select: { id: true, schoolId: true },
      }),
      this.prisma.subject.findFirst({
        where: { id: dto.subjectId, tenantId: user.tenantId, deletedAt: null },
        select: { id: true, schoolId: true },
      }),
    ]);

    if (!classRoom || !subject) {
      throw apiNotFound('ACADEMIC_RESOURCE_NOT_FOUND', 'Classroom or subject not found');
    }
    if (classRoom.schoolId !== subject.schoolId) {
      throw apiBadRequest('ACADEMIC_SCHOOL_MISMATCH', 'Classroom and subject must belong to the same school');
    }

    if (dto.teacherId) {
      const teacher = await this.prisma.teacherProfile.findFirst({
        where: { id: dto.teacherId, tenantId: user.tenantId, deletedAt: null },
        select: { id: true },
      });
      if (!teacher) throw apiNotFound('TEACHER_NOT_FOUND', 'Teacher not found');
    }

    const row = await this.prisma.classroomSubject.upsert({
      where: { classRoomId_subjectId: { classRoomId: dto.classRoomId, subjectId: dto.subjectId } },
      create: {
        tenantId: user.tenantId,
        classRoomId: dto.classRoomId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        createdById: user.sub,
        updatedById: user.sub,
      },
      update: { teacherId: dto.teacherId ?? null, deletedAt: null, updatedById: user.sub },
    });

    return this.list(user, { classRoomId: row.classRoomId });
  }
}
