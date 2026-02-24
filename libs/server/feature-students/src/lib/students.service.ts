import {
  EnrollmentStatus,
  Gender,
  Prisma,
  Student,
} from '@gps/data-access-prisma';
import { apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@gps/data-access-db';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { parse } from 'csv-parse/sync';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { BulkImportStudentsDto } from './dto/bulk-import-students.dto';
import {
  BulkImportStudentErrorDto,
  BulkImportStudentsResponseDto,
} from './dto/bulk-import-students-response.dto';
import { BulkImportStudentsCsvDto } from './dto/bulk-import-students-csv.dto';

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

  async create(authUser: AuthenticatedUser, dto: CreateStudentDto): Promise<StudentResponseDto> {
    try {
      const created = await this.prisma.student.create({
        data: {
          tenantId: authUser.tenantId,
          schoolId: dto.schoolId,
          campusId: dto.campusId,
          admissionNo: dto.admissionNo,
          firstName: dto.firstName,
          lastName: dto.lastName,
          gender: dto.gender ?? Gender.UNDISCLOSED,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
          joinedOn: dto.joinedOn ? new Date(dto.joinedOn) : null,
          profilePhotoKey: dto.profilePhotoKey,
          createdById: authUser.sub,
          updatedById: authUser.sub,
        },
      });

      return this.toResponse(created);
    } catch (err) {
      if (this.isUniqueConstraintError(err, ['schoolId', 'admissionNo'])) {
        throw apiConflict('STUDENT_ADMISSION_NO_CONFLICT', 'Admission number already exists', {
          schoolId: dto.schoolId,
          admissionNo: dto.admissionNo,
        });
      }
      throw err;
    }
  }

  async update(
    authUser: AuthenticatedUser,
    studentId: string,
    dto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    const existing = await this.prisma.student.findFirst({
      where: { id: studentId, tenantId: authUser.tenantId, deletedAt: null },
    });

    if (!existing) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId });
    }

    try {
      const updated = await this.prisma.student.update({
        where: { id: studentId },
        data: {
          ...(dto.schoolId !== undefined ? { schoolId: dto.schoolId } : {}),
          ...(dto.campusId !== undefined ? { campusId: dto.campusId } : {}),
          ...(dto.admissionNo !== undefined ? { admissionNo: dto.admissionNo } : {}),
          ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
          ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
          ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
          ...(dto.dateOfBirth !== undefined
            ? { dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null }
            : {}),
          ...(dto.joinedOn !== undefined
            ? { joinedOn: dto.joinedOn ? new Date(dto.joinedOn) : null }
            : {}),
          ...(dto.profilePhotoKey !== undefined ? { profilePhotoKey: dto.profilePhotoKey } : {}),
          ...(dto.currentStatus !== undefined ? { currentStatus: dto.currentStatus } : {}),
          updatedById: authUser.sub,
        },
      });

      return this.toResponse(updated);
    } catch (err) {
      const schoolId = dto.schoolId ?? existing.schoolId;
      const admissionNo = dto.admissionNo ?? existing.admissionNo;
      if (this.isUniqueConstraintError(err, ['schoolId', 'admissionNo'])) {
        throw apiConflict('STUDENT_ADMISSION_NO_CONFLICT', 'Admission number already exists', {
          schoolId,
          admissionNo,
        });
      }
      throw err;
    }
  }

  async remove(authUser: AuthenticatedUser, studentId: string): Promise<{ success: true }> {
    const existing = await this.prisma.student.findFirst({
      where: { id: studentId, tenantId: authUser.tenantId, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId });
    }

    await this.prisma.student.update({
      where: { id: studentId },
      data: {
        deletedAt: new Date(),
        deletedById: authUser.sub,
        updatedById: authUser.sub,
      },
    });

    return { success: true };
  }

  async bulkImport(
    authUser: AuthenticatedUser,
    dto: BulkImportStudentsDto,
  ): Promise<BulkImportStudentsResponseDto> {
    const created: StudentResponseDto[] = [];
    const errors: BulkImportStudentErrorDto[] = [];

    for (let i = 0; i < dto.records.length; i++) {
      const record = dto.records[i];
      try {
        const student = await this.create(authUser, record);
        created.push(student);
      } catch (err) {
        const apiErr = err as { response?: unknown; message?: string };
        const payload =
          apiErr && typeof apiErr === 'object' && apiErr.response && typeof apiErr.response === 'object'
            ? (apiErr.response as Record<string, unknown>)
            : undefined;
        const code = typeof payload?.code === 'string' ? (payload.code as string) : 'IMPORT_FAILED';
        const message =
          typeof payload?.message === 'string'
            ? (payload.message as string)
            : (apiErr.message ?? 'Import failed');
        errors.push({
          rowIndex: i,
          code,
          message,
          details: { admissionNo: record.admissionNo, schoolId: record.schoolId },
        });
      }
    }

    return {
      createdCount: created.length,
      failedCount: errors.length,
      created,
      errors,
    };
  }

  async bulkImportCsv(
    authUser: AuthenticatedUser,
    dto: BulkImportStudentsCsvDto,
    file?: Express.Multer.File,
  ): Promise<BulkImportStudentsResponseDto> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw apiUnprocessable('STUDENTS_IMPORT_FILE_MISSING', 'CSV file is required');
    }

    const text = file.buffer.toString('utf8');

    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, string>>;

    const records: CreateStudentDto[] = rows.map((row) => ({
      schoolId: dto.schoolId,
      campusId: dto.campusId,
      admissionNo: row.admissionNo,
      firstName: row.firstName,
      lastName: row.lastName || undefined,
      gender: (row.gender as Gender | undefined) ?? undefined,
      dateOfBirth: row.dateOfBirth || undefined,
      joinedOn: row.joinedOn || undefined,
      profilePhotoKey: row.profilePhotoKey || undefined,
    }));

    // Basic required field checks before hitting DB.
    const invalidIndexes = records
      .map((r, idx) => ({ r, idx }))
      .filter(({ r }) => !r.admissionNo || !r.firstName);
    if (invalidIndexes.length > 0) {
      throw apiUnprocessable(
        'STUDENTS_IMPORT_INVALID_ROWS',
        'Some CSV rows are missing required fields (admissionNo, firstName)',
        { invalidRowIndexes: invalidIndexes.map((x) => x.idx) },
      );
    }

    return this.bulkImport(authUser, { records });
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

  private isUniqueConstraintError(err: unknown, fields: string[]): boolean {
    if (!err || typeof err !== 'object') return false;
    const anyErr = err as { code?: string; meta?: { target?: unknown } } & Record<string, unknown>;
    if (anyErr.code !== 'P2002') return false;
    const target = anyErr.meta?.target;
    if (!Array.isArray(target)) return false;
    return fields.every((field) => target.includes(field));
  }
}
