import { PrismaService } from '@gps/data-access-db';
import { ExamStatus, Prisma } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamResponseDto } from './dto/exam-response.dto';
import { ListExamsQueryDto } from './dto/list-exams-query.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ListStudentAssessmentsQueryDto } from './dto/list-student-assessments-query.dto';
import { StudentAssessmentResponseDto } from './dto/student-assessment-response.dto';
import { BulkUpsertStudentAssessmentsDto } from './dto/bulk-upsert-student-assessments.dto';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListExamsQueryDto): Promise<ExamResponseDto[]> {
    const rows = await this.prisma.exam.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
        ...(query.termId ? { termId: query.termId } : {}),
        ...(query.classRoomId ? { classRoomId: query.classRoomId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
                { examType: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        subjects: {
          where: { deletedAt: null },
          orderBy: [{ createdAt: 'asc' }],
        },
      },
      orderBy: [{ startsOn: 'desc' }, { createdAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, examId: string): Promise<ExamResponseDto> {
    const row = await this.prisma.exam.findFirst({
      where: {
        id: examId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      include: {
        subjects: {
          where: { deletedAt: null },
          orderBy: [{ createdAt: 'asc' }],
        },
      },
    });

    if (!row) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    return this.toResponse(row);
  }

  async create(user: AuthenticatedUser, dto: CreateExamDto): Promise<ExamResponseDto> {
    try {
      const created = await this.prisma.exam.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          academicYearId: dto.academicYearId,
          termId: dto.termId,
          classRoomId: dto.classRoomId,
          teacherId: dto.teacherId,
          code: dto.code,
          name: dto.name,
          examType: dto.examType,
          startsOn: new Date(dto.startsOn),
          endsOn: dto.endsOn ? new Date(dto.endsOn) : null,
          status: dto.status ?? ExamStatus.DRAFT,
          createdById: user.sub,
          updatedById: user.sub,
          subjects: dto.subjects?.length
            ? {
                create: dto.subjects.map((s) => ({
                  tenantId: user.tenantId,
                  subjectId: s.subjectId,
                  maxMarks: new Prisma.Decimal(s.maxMarks),
                  passMarks: s.passMarks ? new Prisma.Decimal(s.passMarks) : null,
                  weightage: s.weightage ? new Prisma.Decimal(s.weightage) : null,
                  createdById: user.sub,
                  updatedById: user.sub,
                })),
              }
            : undefined,
        },
        include: {
          subjects: {
            where: { deletedAt: null },
            orderBy: [{ createdAt: 'asc' }],
          },
        },
      });

      return this.toResponse(created);
    } catch (err) {
      if (this.isUniqueConstraintError(err, ['schoolId', 'code'])) {
        throw apiConflict(
          'EXAM_CODE_CONFLICT',
          'Exam code already exists for this school',
          { schoolId: dto.schoolId, code: dto.code },
        );
      }
      throw err;
    }
  }

  async update(user: AuthenticatedUser, examId: string, dto: UpdateExamDto): Promise<ExamResponseDto> {
    const existing = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true, schoolId: true },
    });

    if (!existing) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    try {
      const updated = await this.prisma.exam.update({
        where: { id: examId },
        data: {
          ...(dto.schoolId !== undefined ? { schoolId: dto.schoolId } : {}),
          ...(dto.academicYearId !== undefined ? { academicYearId: dto.academicYearId } : {}),
          ...(dto.termId !== undefined ? { termId: dto.termId } : {}),
          ...(dto.classRoomId !== undefined ? { classRoomId: dto.classRoomId } : {}),
          ...(dto.teacherId !== undefined ? { teacherId: dto.teacherId } : {}),
          ...(dto.code !== undefined ? { code: dto.code } : {}),
          ...(dto.name !== undefined ? { name: dto.name } : {}),
          ...(dto.examType !== undefined ? { examType: dto.examType } : {}),
          ...(dto.startsOn !== undefined ? { startsOn: new Date(dto.startsOn) } : {}),
          ...(dto.endsOn !== undefined ? { endsOn: dto.endsOn ? new Date(dto.endsOn) : null } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          updatedById: user.sub,
        },
        include: {
          subjects: {
            where: { deletedAt: null },
            orderBy: [{ createdAt: 'asc' }],
          },
        },
      });

      return this.toResponse(updated);
    } catch (err) {
      const schoolId = dto.schoolId ?? existing.schoolId;
      const code = dto.code ?? undefined;
      if (code && this.isUniqueConstraintError(err, ['schoolId', 'code'])) {
        throw apiConflict(
          'EXAM_CODE_CONFLICT',
          'Exam code already exists for this school',
          { schoolId, code },
        );
      }
      throw err;
    }
  }

  async remove(user: AuthenticatedUser, examId: string): Promise<{ success: true }> {
    const existing = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });

    if (!existing) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    await this.prisma.exam.update({
      where: { id: examId },
      data: {
        deletedAt: new Date(),
        deletedById: user.sub,
        updatedById: user.sub,
      },
    });

    return { success: true };
  }

  async publishExam(user: AuthenticatedUser, examId: string): Promise<ExamResponseDto> {
    const existing = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      include: { subjects: { where: { deletedAt: null }, orderBy: [{ createdAt: 'asc' }] } },
    });

    if (!existing) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    if (existing.status === ExamStatus.PUBLISHED || existing.status === ExamStatus.COMPLETED) {
      return this.toResponse(existing);
    }

    if (existing.status !== ExamStatus.DRAFT) {
      throw apiUnprocessable('EXAM_INVALID_STATUS', 'Exam cannot be published from current status', {
        examId,
        status: existing.status,
      });
    }

    const updated = await this.prisma.exam.update({
      where: { id: examId },
      data: { status: ExamStatus.PUBLISHED, updatedById: user.sub },
      include: { subjects: { where: { deletedAt: null }, orderBy: [{ createdAt: 'asc' }] } },
    });

    return this.toResponse(updated);
  }

  async completeExam(user: AuthenticatedUser, examId: string): Promise<ExamResponseDto> {
    const existing = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      include: { subjects: { where: { deletedAt: null }, orderBy: [{ createdAt: 'asc' }] } },
    });

    if (!existing) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    if (existing.status === ExamStatus.COMPLETED) {
      return this.toResponse(existing);
    }

    if (existing.status !== ExamStatus.PUBLISHED) {
      throw apiUnprocessable('EXAM_INVALID_STATUS', 'Exam cannot be completed from current status', {
        examId,
        status: existing.status,
      });
    }

    const updated = await this.prisma.exam.update({
      where: { id: examId },
      data: { status: ExamStatus.COMPLETED, updatedById: user.sub },
      include: { subjects: { where: { deletedAt: null }, orderBy: [{ createdAt: 'asc' }] } },
    });

    return this.toResponse(updated);
  }

  async listAssessments(
    user: AuthenticatedUser,
    examId: string,
    query: ListStudentAssessmentsQueryDto,
  ): Promise<StudentAssessmentResponseDto[]> {
    const exam = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!exam) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    const rows = await this.prisma.studentAssessment.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        examId,
        ...(query.examSubjectId ? { examSubjectId: query.examSubjectId } : {}),
        ...(query.studentId ? { studentId: query.studentId } : {}),
      },
      orderBy: [{ updatedAt: 'desc' }],
    });

    return rows.map((row) => ({
      id: row.id,
      tenantId: row.tenantId,
      examId: row.examId,
      examSubjectId: row.examSubjectId,
      studentId: row.studentId,
      marksObtained: row.marksObtained ? row.marksObtained.toString() : null,
      grade: row.grade,
      remarks: row.remarks,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async bulkUpsertAssessments(
    user: AuthenticatedUser,
    examId: string,
    dto: BulkUpsertStudentAssessmentsDto,
  ): Promise<StudentAssessmentResponseDto[]> {
    const exam = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!exam) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    if (exam.status === ExamStatus.COMPLETED || exam.status === ExamStatus.ARCHIVED) {
      throw apiUnprocessable('EXAM_MARKS_LOCKED', 'Exam is locked for marks entry', {
        examId,
        status: exam.status,
      });
    }

    const allowedExamSubjectIds = new Set(
      (
        await this.prisma.examSubject.findMany({
          where: { examId, tenantId: user.tenantId, deletedAt: null },
          select: { id: true },
        })
      ).map((x) => x.id),
    );

    const invalid = dto.records.filter((r) => !allowedExamSubjectIds.has(r.examSubjectId));
    if (invalid.length > 0) {
      throw apiUnprocessable(
        'EXAM_SUBJECT_INVALID',
        'One or more examSubjectId values do not belong to this exam',
        { invalidExamSubjectIds: invalid.map((x) => x.examSubjectId) },
      );
    }

    await this.prisma.$transaction(
      dto.records.map((record) =>
        this.prisma.studentAssessment.upsert({
          where: {
            examSubjectId_studentId: {
              examSubjectId: record.examSubjectId,
              studentId: record.studentId,
            },
          },
          create: {
            tenantId: user.tenantId,
            examId,
            examSubjectId: record.examSubjectId,
            studentId: record.studentId,
            marksObtained: record.marksObtained ? new Prisma.Decimal(record.marksObtained) : null,
            grade: record.grade,
            remarks: record.remarks,
            createdById: user.sub,
            updatedById: user.sub,
          },
          update: {
            marksObtained: record.marksObtained ? new Prisma.Decimal(record.marksObtained) : null,
            grade: record.grade,
            remarks: record.remarks,
            updatedById: user.sub,
          },
        }),
      ),
    );

    return this.listAssessments(user, examId, {});
  }

  async publishAssessments(
    user: AuthenticatedUser,
    examId: string,
  ): Promise<{ success: true; publishedCount: number }> {
    const exam = await this.prisma.exam.findFirst({
      where: { id: examId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true, status: true },
    });
    if (!exam) {
      throw apiNotFound('EXAM_NOT_FOUND', 'Exam not found', { examId });
    }

    if (exam.status === ExamStatus.DRAFT) {
      throw apiUnprocessable(
        'EXAM_NOT_PUBLISHED',
        'Publish the exam before publishing assessments',
        { examId },
      );
    }

    const now = new Date();
    const result = await this.prisma.studentAssessment.updateMany({
      where: { tenantId: user.tenantId, examId, deletedAt: null },
      data: { publishedAt: now, updatedById: user.sub },
    });

    // Optional: automatically complete after publishing marks.
    if (exam.status === ExamStatus.PUBLISHED) {
      await this.prisma.exam.update({
        where: { id: examId },
        data: { status: ExamStatus.COMPLETED, updatedById: user.sub },
      });
    }

    return { success: true, publishedCount: result.count };
  }

  private toResponse(
    row: Prisma.ExamGetPayload<{ include: { subjects: true } }>,
  ): ExamResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      academicYearId: row.academicYearId,
      termId: row.termId,
      classRoomId: row.classRoomId,
      teacherId: row.teacherId,
      code: row.code,
      name: row.name,
      examType: row.examType,
      startsOn: row.startsOn.toISOString(),
      endsOn: row.endsOn ? row.endsOn.toISOString() : null,
      status: row.status,
      subjects: row.subjects.map((s) => ({
        id: s.id,
        tenantId: s.tenantId,
        examId: s.examId,
        subjectId: s.subjectId,
        maxMarks: s.maxMarks.toString(),
        passMarks: s.passMarks ? s.passMarks.toString() : null,
        weightage: s.weightage ? s.weightage.toString() : null,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
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
