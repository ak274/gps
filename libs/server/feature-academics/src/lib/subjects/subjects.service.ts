import { PrismaService } from '@gps/data-access-db';
import { Subject } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { ListSubjectsQueryDto } from './dto/list-subjects-query.dto';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListSubjectsQueryDto): Promise<SubjectResponseDto[]> {
    const rows = await this.prisma.subject.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ code: 'asc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, subjectId: string): Promise<SubjectResponseDto> {
    const row = await this.prisma.subject.findFirst({
      where: {
        id: subjectId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('SUBJECT_NOT_FOUND', 'Subject not found', { subjectId });
    }

    return this.toResponse(row);
  }

  async create(user: AuthenticatedUser, dto: CreateSubjectDto): Promise<SubjectResponseDto> {
    const duplicate = await this.prisma.subject.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        code: dto.code,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (duplicate) {
      throw apiConflict('SUBJECT_CODE_CONFLICT', 'Subject code already exists for this school', {
        schoolId: dto.schoolId,
        code: dto.code,
      });
    }

    const created = await this.prisma.subject.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        code: dto.code,
        name: dto.name,
        isOptional: dto.isOptional ?? false,
      },
    });

    return this.toResponse(created);
  }

  async update(
    user: AuthenticatedUser,
    subjectId: string,
    dto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const existing = await this.prisma.subject.findFirst({
      where: {
        id: subjectId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('SUBJECT_NOT_FOUND', 'Subject not found', { subjectId });
    }

    const updated = await this.prisma.subject.update({
      where: { id: subjectId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.isOptional !== undefined ? { isOptional: dto.isOptional } : {}),
      },
    });

    return this.toResponse(updated);
  }

  private toResponse(row: Subject): SubjectResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      code: row.code,
      name: row.name,
      isOptional: row.isOptional,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
