import { PrismaService } from '@gps/data-access-db';
import { Homework, HomeworkStatus } from '@gps/data-access-prisma';
import { apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { HomeworkResponseDto } from './dto/homework-response.dto';
import { ListHomeworkQueryDto } from './dto/list-homework-query.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';

@Injectable()
export class HomeworkService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListHomeworkQueryDto): Promise<HomeworkResponseDto[]> {
    const rows = await this.prisma.homework.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.classRoomId ? { classRoomId: query.classRoomId } : {}),
        ...(query.subjectId ? { subjectId: query.subjectId } : {}),
        ...(query.teacherId ? { teacherId: query.teacherId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.search
          ? {
              OR: [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ assignedOn: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, homeworkId: string): Promise<HomeworkResponseDto> {
    const row = await this.prisma.homework.findFirst({
      where: { id: homeworkId, tenantId: user.tenantId, deletedAt: null },
    });

    if (!row) {
      throw apiNotFound('HOMEWORK_NOT_FOUND', 'Homework not found', { homeworkId });
    }

    return this.toResponse(row);
  }

  async create(user: AuthenticatedUser, dto: CreateHomeworkDto): Promise<HomeworkResponseDto> {
    const created = await this.prisma.homework.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        classRoomId: dto.classRoomId,
        subjectId: dto.subjectId,
        teacherId: dto.teacherId,
        title: dto.title,
        description: dto.description,
        assignedOn: new Date(dto.assignedOn),
        dueOn: dto.dueOn ? new Date(dto.dueOn) : null,
        status: dto.status ?? HomeworkStatus.DRAFT,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toResponse(created);
  }

  async update(
    user: AuthenticatedUser,
    homeworkId: string,
    dto: UpdateHomeworkDto,
  ): Promise<HomeworkResponseDto> {
    const existing = await this.prisma.homework.findFirst({
      where: { id: homeworkId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw apiNotFound('HOMEWORK_NOT_FOUND', 'Homework not found', { homeworkId });
    }

    const updated = await this.prisma.homework.update({
      where: { id: homeworkId },
      data: {
        ...(dto.schoolId !== undefined ? { schoolId: dto.schoolId } : {}),
        ...(dto.classRoomId !== undefined ? { classRoomId: dto.classRoomId } : {}),
        ...(dto.subjectId !== undefined ? { subjectId: dto.subjectId } : {}),
        ...(dto.teacherId !== undefined ? { teacherId: dto.teacherId } : {}),
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.assignedOn !== undefined ? { assignedOn: new Date(dto.assignedOn) } : {}),
        ...(dto.dueOn !== undefined ? { dueOn: dto.dueOn ? new Date(dto.dueOn) : null } : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        updatedById: user.sub,
      },
    });

    return this.toResponse(updated);
  }

  async remove(user: AuthenticatedUser, homeworkId: string): Promise<{ success: true }> {
    const existing = await this.prisma.homework.findFirst({
      where: { id: homeworkId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw apiNotFound('HOMEWORK_NOT_FOUND', 'Homework not found', { homeworkId });
    }

    await this.prisma.homework.update({
      where: { id: homeworkId },
      data: {
        deletedAt: new Date(),
        deletedById: user.sub,
        updatedById: user.sub,
      },
    });

    return { success: true };
  }

  private toResponse(row: Homework): HomeworkResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      classRoomId: row.classRoomId,
      subjectId: row.subjectId,
      teacherId: row.teacherId,
      title: row.title,
      description: row.description,
      assignedOn: row.assignedOn.toISOString(),
      dueOn: row.dueOn ? row.dueOn.toISOString() : null,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}

