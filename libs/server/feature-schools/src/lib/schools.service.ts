import { PrismaService } from '@gps/data-access-db';
import { School } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsQueryDto } from './dto/list-schools-query.dto';
import { SchoolResponseDto } from './dto/school-response.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListSchoolsQueryDto): Promise<SchoolResponseDto[]> {
    const rows = await this.prisma.school.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ name: 'asc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, schoolId: string): Promise<SchoolResponseDto> {
    const school = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!school) {
      throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId });
    }

    return this.toResponse(school);
  }

  async create(user: AuthenticatedUser, dto: CreateSchoolDto): Promise<SchoolResponseDto> {
    const exists = await this.prisma.school.findFirst({
      where: {
        tenantId: user.tenantId,
        code: dto.code,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (exists) {
      throw apiConflict(
        'SCHOOL_CODE_CONFLICT',
        'School code already exists in this tenant',
        { code: dto.code },
      );
    }

    const school = await this.prisma.school.create({
      data: {
        tenantId: user.tenantId,
        code: dto.code,
        name: dto.name,
        board: dto.board,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
      },
    });

    return this.toResponse(school);
  }

  async update(
    user: AuthenticatedUser,
    schoolId: string,
    dto: UpdateSchoolDto,
  ): Promise<SchoolResponseDto> {
    const existing = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId });
    }

    const updated = await this.prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.board !== undefined ? { board: dto.board } : {}),
        ...(dto.contactEmail !== undefined ? { contactEmail: dto.contactEmail } : {}),
        ...(dto.contactPhone !== undefined ? { contactPhone: dto.contactPhone } : {}),
      },
    });

    return this.toResponse(updated);
  }

  private toResponse(school: School): SchoolResponseDto {
    return {
      id: school.id,
      tenantId: school.tenantId,
      code: school.code,
      name: school.name,
      board: school.board,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone,
      createdAt: school.createdAt.toISOString(),
      updatedAt: school.updatedAt.toISOString(),
    };
  }
}
