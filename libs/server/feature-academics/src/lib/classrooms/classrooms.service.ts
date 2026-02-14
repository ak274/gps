import { PrismaService } from '@gps/data-access-db';
import { ClassRoom, Prisma } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateClassWithSectionsDto } from './dto/create-class-with-sections.dto';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { ClassWithSectionsResponseDto } from './dto/class-with-sections-response.dto';
import { ClassroomResponseDto } from './dto/classroom-response.dto';
import { ListClassSectionsQueryDto } from './dto/list-class-sections-query.dto';
import { ListClassroomsQueryDto } from './dto/list-classrooms-query.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListClassroomsQueryDto): Promise<ClassroomResponseDto[]> {
    const rows = await this.prisma.classRoom.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { gradeLevel: { contains: query.search, mode: 'insensitive' } },
                { section: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async listWithSections(
    user: AuthenticatedUser,
    query: ListClassSectionsQueryDto,
  ): Promise<ClassWithSectionsResponseDto[]> {
    const rows = await this.prisma.classRoom.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { gradeLevel: { contains: query.search, mode: 'insensitive' } },
                { section: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ gradeLevel: 'asc' }, { name: 'asc' }, { section: 'asc' }],
    });

    const grouped = new Map<string, ClassWithSectionsResponseDto>();

    for (const row of rows) {
      const key = `${row.schoolId}::${row.academicYearId}::${row.name}::${row.gradeLevel}`;
      const existing = grouped.get(key);
      if (!existing) {
        grouped.set(key, {
          schoolId: row.schoolId,
          academicYearId: row.academicYearId,
          name: row.name,
          gradeLevel: row.gradeLevel,
          sections: row.section ? [row.section] : [],
          classroomIds: [row.id],
        });
        continue;
      }

      existing.classroomIds.push(row.id);
      if (row.section && !existing.sections.includes(row.section)) {
        existing.sections.push(row.section);
      }
    }

    return Array.from(grouped.values()).map((item) => ({
      ...item,
      sections: item.sections.sort((a, b) => a.localeCompare(b)),
    }));
  }

  async findById(user: AuthenticatedUser, classroomId: string): Promise<ClassroomResponseDto> {
    const row = await this.prisma.classRoom.findFirst({
      where: {
        id: classroomId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('CLASSROOM_NOT_FOUND', 'Classroom not found', { classroomId });
    }

    return this.toResponse(row);
  }

  async create(user: AuthenticatedUser, dto: CreateClassroomDto): Promise<ClassroomResponseDto> {
    const duplicate = await this.findDuplicateClassroom(user.tenantId, {
      academicYearId: dto.academicYearId,
      name: dto.name,
      section: dto.section,
    });

    if (duplicate) {
      throw apiConflict(
        'CLASSROOM_SECTION_CONFLICT',
        'Classroom section already exists for this class and academic year',
        {
          name: dto.name,
          academicYearId: dto.academicYearId,
          section: dto.section ?? null,
        },
      );
    }

    const created = await this.prisma.classRoom.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        campusId: dto.campusId,
        academicYearId: dto.academicYearId,
        name: dto.name,
        gradeLevel: dto.gradeLevel,
        section: dto.section,
        capacity: dto.capacity,
        homeRoomTeacherId: dto.homeRoomTeacherId,
      },
    });

    return this.toResponse(created);
  }

  async createWithSections(
    user: AuthenticatedUser,
    dto: CreateClassWithSectionsDto,
  ): Promise<ClassroomResponseDto[]> {
    const normalizedSections = Array.from(
      new Set(
        dto.sections
          .map((section) => section.trim())
          .filter((section) => section.length > 0),
      ),
    );

    if (normalizedSections.length === 0) {
      throw apiConflict(
        'CLASSROOM_SECTION_INVALID',
        'At least one non-empty section is required',
      );
    }

    const existing = await this.prisma.classRoom.findMany({
      where: {
        tenantId: user.tenantId,
        academicYearId: dto.academicYearId,
        name: dto.name,
        section: { in: normalizedSections },
        deletedAt: null,
      },
      select: { id: true, section: true },
    });

    if (existing.length > 0) {
      throw apiConflict(
        'CLASSROOM_SECTION_CONFLICT',
        'One or more sections already exist for this class and academic year',
        {
          name: dto.name,
          academicYearId: dto.academicYearId,
          existingSections: existing.map((item) => item.section).filter(Boolean),
        },
      );
    }

    const created = await this.prisma.$transaction(
      normalizedSections.map((section) =>
        this.prisma.classRoom.create({
          data: {
            tenantId: user.tenantId,
            schoolId: dto.schoolId,
            campusId: dto.campusId,
            academicYearId: dto.academicYearId,
            name: dto.name,
            gradeLevel: dto.gradeLevel,
            section,
            capacity: dto.capacity,
            homeRoomTeacherId: dto.homeRoomTeacherId,
          },
        }),
      ),
    );

    return created.map((row) => this.toResponse(row));
  }

  async update(
    user: AuthenticatedUser,
    classroomId: string,
    dto: UpdateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    const existing = await this.prisma.classRoom.findFirst({
      where: {
        id: classroomId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('CLASSROOM_NOT_FOUND', 'Classroom not found', { classroomId });
    }

    if (dto.name !== undefined || dto.section !== undefined || dto.gradeLevel !== undefined) {
      const duplicate = await this.findDuplicateClassroom(user.tenantId, {
        academicYearId: existing.academicYearId,
        name: dto.name ?? existing.name,
        section: dto.section ?? existing.section ?? undefined,
        excludeId: existing.id,
      });
      if (duplicate) {
        throw apiConflict(
          'CLASSROOM_SECTION_CONFLICT',
          'Classroom section already exists for this class and academic year',
          {
            name: dto.name ?? existing.name,
            academicYearId: existing.academicYearId,
            section: dto.section ?? existing.section ?? null,
          },
        );
      }
    }

    const updated = await this.prisma.classRoom.update({
      where: { id: classroomId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.gradeLevel !== undefined ? { gradeLevel: dto.gradeLevel } : {}),
        ...(dto.section !== undefined ? { section: dto.section } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.homeRoomTeacherId !== undefined
          ? { homeRoomTeacherId: dto.homeRoomTeacherId }
          : {}),
      },
    });

    return this.toResponse(updated);
  }

  private toResponse(row: ClassRoom): ClassroomResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      campusId: row.campusId,
      academicYearId: row.academicYearId,
      name: row.name,
      gradeLevel: row.gradeLevel,
      section: row.section,
      capacity: row.capacity,
      homeRoomTeacherId: row.homeRoomTeacherId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private async findDuplicateClassroom(
    tenantId: string,
    params: {
      academicYearId: string;
      name: string;
      section?: string;
      excludeId?: string;
    },
  ) {
    const where: Prisma.ClassRoomWhereInput = {
      tenantId,
      academicYearId: params.academicYearId,
      name: params.name,
      deletedAt: null,
      section: params.section ?? null,
      ...(params.excludeId ? { id: { not: params.excludeId } } : {}),
    };

    return this.prisma.classRoom.findFirst({
      where,
      select: { id: true },
    });
  }
}
