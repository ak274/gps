import {
  EnrollmentStatus,
  Prisma,
  Student,
} from '@gps/data-access-prisma';
import { apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gps/data-access-db';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { StudentResponseDto } from './dto/student-response.dto';

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    authUser: AuthenticatedUser,
    query: ListStudentsQueryDto,
  ): Promise<{ data: StudentResponseDto[]; pagination: { page: number; pageSize: number; total: number } }> {
    const skip = (query.page - 1) * query.pageSize;
    const where = this.buildWhereClause(authUser, query);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: query.pageSize,
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      data: rows.map((row) => this.toResponse(row)),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
      },
    };
  }

  async findById(authUser: AuthenticatedUser, studentId: string): Promise<StudentResponseDto> {
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
        tenantId: authUser.tenantId,
        deletedAt: null,
      },
    });

    if (!student) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', {
        studentId,
      });
    }

    return this.toResponse(student);
  }

  private buildWhereClause(
    authUser: AuthenticatedUser,
    query: ListStudentsQueryDto,
  ): Prisma.StudentWhereInput {
    const where: Prisma.StudentWhereInput = {
      tenantId: authUser.tenantId,
      deletedAt: null,
    };

    if (query.schoolId) {
      where.schoolId = query.schoolId;
    }

    if (query.status) {
      where.currentStatus = query.status as EnrollmentStatus;
    }

    if (query.search) {
      where.OR = [
        {
          admissionNo: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          firstName: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    return where;
  }

  private toResponse(student: Student): StudentResponseDto {
    return {
      id: student.id,
      tenantId: student.tenantId,
      schoolId: student.schoolId,
      campusId: student.campusId,
      admissionNo: student.admissionNo,
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender,
      currentStatus: student.currentStatus,
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.toISOString() : null,
      joinedOn: student.joinedOn ? student.joinedOn.toISOString() : null,
      profilePhotoKey: student.profilePhotoKey,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }
}
