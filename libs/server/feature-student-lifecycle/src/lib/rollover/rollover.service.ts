import { PrismaService } from '@gps/data-access-db';
import { apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CopyAcademicStructureDto } from './dto/copy-academic-structure.dto';
import { SetCurrentAcademicYearDto } from './dto/set-current-academic-year.dto';

type ClassKey = `${string}|${string}`; // gradeLevel|section

@Injectable()
export class RolloverService {
  constructor(private readonly prisma: PrismaService) {}

  async copyAcademicStructure(
    user: AuthenticatedUser,
    dto: CopyAcademicStructureDto,
  ): Promise<{ success: true; createdClassRooms: number; createdClassroomSubjects: number }> {
    const [fromYear, toYear] = await this.prisma.$transaction([
      this.prisma.academicYear.findFirst({
        where: {
          id: dto.fromAcademicYearId,
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          deletedAt: null,
        },
        select: { id: true },
      }),
      this.prisma.academicYear.findFirst({
        where: { id: dto.toAcademicYearId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null },
        select: { id: true },
      }),
    ]);

    if (!fromYear || !toYear) {
      throw apiUnprocessable('ACADEMIC_YEAR_INVALID', 'Academic years are invalid for this rollover', {
        fromAcademicYearId: dto.fromAcademicYearId,
        toAcademicYearId: dto.toAcademicYearId,
      });
    }

    const fromClasses = await this.prisma.classRoom.findMany({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        academicYearId: dto.fromAcademicYearId,
        deletedAt: null,
      },
      select: {
        id: true,
        campusId: true,
        name: true,
        gradeLevel: true,
        section: true,
        capacity: true,
      },
    });

    const toClasses = await this.prisma.classRoom.findMany({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        academicYearId: dto.toAcademicYearId,
        deletedAt: null,
      },
      select: { id: true, gradeLevel: true, section: true },
    });

    const toByKey = new Map<ClassKey, string>();
    for (const c of toClasses) {
      const key: ClassKey = `${c.gradeLevel}|${c.section ?? ''}`;
      toByKey.set(key, c.id);
    }

    // Create missing class rooms for the next year (by gradeLevel+section).
    let createdClassRooms = 0;
    const createdClassRoomIdsByFrom = new Map<string, string>();

    await this.prisma.$transaction(async (tx) => {
      for (const c of fromClasses) {
        const key: ClassKey = `${c.gradeLevel}|${c.section ?? ''}`;
        const existingId = toByKey.get(key);
        if (existingId) {
          createdClassRoomIdsByFrom.set(c.id, existingId);
          continue;
        }

        const created = await tx.classRoom.create({
          data: {
            tenantId: user.tenantId,
            schoolId: dto.schoolId,
            campusId: c.campusId,
            academicYearId: dto.toAcademicYearId,
            name: c.name,
            gradeLevel: c.gradeLevel,
            section: c.section,
            capacity: c.capacity,
            homeRoomTeacherId: null, // reshuffled every year
            createdById: user.sub,
            updatedById: user.sub,
          },
          select: { id: true },
        });

        createdClassRooms++;
        toByKey.set(key, created.id);
        createdClassRoomIdsByFrom.set(c.id, created.id);
      }
    });

    if (dto.copyClassroomSubjects === false) {
      return { success: true, createdClassRooms, createdClassroomSubjects: 0 };
    }

    // Copy classroom-subject mappings, clearing teacher assignment.
    const fromMappings = await this.prisma.classroomSubject.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        classRoom: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          academicYearId: dto.fromAcademicYearId,
          deletedAt: null,
        },
      },
      select: {
        classRoomId: true,
        subjectId: true,
      },
    });

    // Build a "existing mapping" set to avoid duplicates in to-year.
    const existingToMappings = await this.prisma.classroomSubject.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        classRoom: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          academicYearId: dto.toAcademicYearId,
          deletedAt: null,
        },
      },
      select: { classRoomId: true, subjectId: true },
    });
    const existingSet = new Set(existingToMappings.map((m) => `${m.classRoomId}:${m.subjectId}`));

    const toCreates = fromMappings
      .map((m) => {
        const toClassRoomId = createdClassRoomIdsByFrom.get(m.classRoomId);
        if (!toClassRoomId) return null;
        const key = `${toClassRoomId}:${m.subjectId}`;
        if (existingSet.has(key)) return null;
        existingSet.add(key);
        return {
          tenantId: user.tenantId,
          classRoomId: toClassRoomId,
          subjectId: m.subjectId,
          teacherId: null,
          createdById: user.sub,
          updatedById: user.sub,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    if (toCreates.length === 0) {
      return { success: true, createdClassRooms, createdClassroomSubjects: 0 };
    }

    // createMany doesn't return rows; we can return count based on input.
    await this.prisma.classroomSubject.createMany({ data: toCreates, skipDuplicates: true });

    return { success: true, createdClassRooms, createdClassroomSubjects: toCreates.length };
  }

  async setCurrentAcademicYear(user: AuthenticatedUser, dto: SetCurrentAcademicYearDto): Promise<{ success: true }> {
    const year = await this.prisma.academicYear.findFirst({
      where: { id: dto.academicYearId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null },
      select: { id: true },
    });
    if (!year) {
      throw apiUnprocessable('ACADEMIC_YEAR_NOT_FOUND', 'Academic year not found', { academicYearId: dto.academicYearId });
    }

    await this.prisma.$transaction([
      this.prisma.academicYear.updateMany({
        where: { tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null },
        data: { isCurrent: false, updatedById: user.sub },
      }),
      this.prisma.academicYear.update({
        where: { id: dto.academicYearId },
        data: { isCurrent: true, updatedById: user.sub },
      }),
    ]);

    return { success: true };
  }
}

