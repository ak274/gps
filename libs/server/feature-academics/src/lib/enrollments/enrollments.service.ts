import { PrismaService } from '@gps/data-access-db';
import { Enrollment, EnrollmentStatus } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponseDto } from './dto/enrollment-response.dto';
import { ListEnrollmentsQueryDto } from './dto/list-enrollments-query.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListEnrollmentsQueryDto): Promise<EnrollmentResponseDto[]> {
    const rows = await this.prisma.enrollment.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.classRoomId ? { classRoomId: query.classRoomId } : {}),
        ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, enrollmentId: string): Promise<EnrollmentResponseDto> {
    const row = await this.prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('ENROLLMENT_NOT_FOUND', 'Enrollment not found', { enrollmentId });
    }

    return this.toResponse(row);
  }

  async create(user: AuthenticatedUser, dto: CreateEnrollmentDto): Promise<EnrollmentResponseDto> {
    const duplicate = await this.prisma.enrollment.findFirst({
      where: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        academicYearId: dto.academicYearId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (duplicate) {
      throw apiConflict(
        'ENROLLMENT_STUDENT_YEAR_CONFLICT',
        'Student already has enrollment for this academic year',
        {
          studentId: dto.studentId,
          academicYearId: dto.academicYearId,
        },
      );
    }

    const created = await this.prisma.enrollment.create({
      data: {
        tenantId: user.tenantId,
        studentId: dto.studentId,
        classRoomId: dto.classRoomId,
        academicYearId: dto.academicYearId,
        status: dto.status ?? EnrollmentStatus.ACTIVE,
        enrolledOn: new Date(dto.enrolledOn),
        leftOn: dto.leftOn ? new Date(dto.leftOn) : null,
      },
    });

    return this.toResponse(created);
  }

  async update(
    user: AuthenticatedUser,
    enrollmentId: string,
    dto: UpdateEnrollmentDto,
  ): Promise<EnrollmentResponseDto> {
    const existing = await this.prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('ENROLLMENT_NOT_FOUND', 'Enrollment not found', { enrollmentId });
    }

    const updated = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        ...(dto.status !== undefined ? { status: dto.status } : {}),
        ...(dto.leftOn !== undefined ? { leftOn: new Date(dto.leftOn) } : {}),
      },
    });

    return this.toResponse(updated);
  }

  private toResponse(row: Enrollment): EnrollmentResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      studentId: row.studentId,
      classRoomId: row.classRoomId,
      academicYearId: row.academicYearId,
      status: row.status,
      enrolledOn: row.enrolledOn.toISOString(),
      leftOn: row.leftOn ? row.leftOn.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
