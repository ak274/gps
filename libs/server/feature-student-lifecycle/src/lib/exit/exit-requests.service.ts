import { PrismaService } from '@gps/data-access-db';
import {
  EnrollmentStatus,
  ExitReason,
  ExitRequestStatus,
  StudentExitRequest,
} from '@gps/data-access-prisma';
import { apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateExitRequestDto } from './dto/create-exit-request.dto';
import { ExitRequestResponseDto } from './dto/exit-request-response.dto';
import { ApproveExitRequestDto } from './dto/approve-exit-request.dto';
import { RejectExitRequestDto } from './dto/reject-exit-request.dto';

@Injectable()
export class ExitRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, dto: CreateExitRequestDto): Promise<ExitRequestResponseDto> {
    const student = await this.prisma.student.findFirst({
      where: { id: dto.studentId, tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null },
      select: { id: true },
    });
    if (!student) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId: dto.studentId });
    }

    const effectiveOn = dto.effectiveOn ? new Date(dto.effectiveOn) : null;
    const created = await this.prisma.studentExitRequest.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        studentId: dto.studentId,
        status: ExitRequestStatus.REQUESTED,
        reason: dto.reason,
        forwardingSchoolName: dto.forwardingSchoolName ?? null,
        forwardingSchoolAddress: dto.forwardingSchoolAddress ?? null,
        notes: dto.notes ?? null,
        requestedById: user.sub,
        requestedAt: new Date(),
        effectiveOn,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toResponse(created);
  }

  async list(user: AuthenticatedUser, schoolId?: string): Promise<ExitRequestResponseDto[]> {
    const rows = await this.prisma.studentExitRequest.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolId ? { schoolId } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });
    return rows.map((r) => this.toResponse(r));
  }

  async findById(user: AuthenticatedUser, exitRequestId: string): Promise<ExitRequestResponseDto> {
    const row = await this.prisma.studentExitRequest.findFirst({
      where: { id: exitRequestId, tenantId: user.tenantId, deletedAt: null },
    });
    if (!row) {
      throw apiNotFound('EXIT_REQUEST_NOT_FOUND', 'Exit request not found', { exitRequestId });
    }
    return this.toResponse(row);
  }

  async approve(
    user: AuthenticatedUser,
    exitRequestId: string,
    dto: ApproveExitRequestDto,
  ): Promise<ExitRequestResponseDto> {
    const row = await this.getOrThrow(user, exitRequestId);
    if (row.status !== ExitRequestStatus.REQUESTED) {
      throw apiUnprocessable('EXIT_REQUEST_INVALID_STATUS', 'Exit request cannot be approved from current status', {
        exitRequestId,
        status: row.status,
      });
    }

    const effectiveOn = dto.effectiveOn ? new Date(dto.effectiveOn) : row.effectiveOn ?? null;

    const updated = await this.prisma.studentExitRequest.update({
      where: { id: exitRequestId },
      data: {
        status: ExitRequestStatus.APPROVED,
        decidedById: user.sub,
        decidedAt: new Date(),
        decisionNotes: dto.decisionNotes ?? null,
        effectiveOn,
        updatedById: user.sub,
      },
    });

    return this.toResponse(updated);
  }

  async reject(user: AuthenticatedUser, exitRequestId: string, dto: RejectExitRequestDto): Promise<ExitRequestResponseDto> {
    const row = await this.getOrThrow(user, exitRequestId);
    if (row.status !== ExitRequestStatus.REQUESTED) {
      throw apiUnprocessable('EXIT_REQUEST_INVALID_STATUS', 'Exit request cannot be rejected from current status', {
        exitRequestId,
        status: row.status,
      });
    }

    const updated = await this.prisma.studentExitRequest.update({
      where: { id: exitRequestId },
      data: {
        status: ExitRequestStatus.REJECTED,
        decidedById: user.sub,
        decidedAt: new Date(),
        decisionNotes: dto.decisionNotes ?? null,
        updatedById: user.sub,
      },
    });

    return this.toResponse(updated);
  }

  async complete(user: AuthenticatedUser, exitRequestId: string): Promise<{ success: true }> {
    const row = await this.getOrThrow(user, exitRequestId);
    if (row.status !== ExitRequestStatus.APPROVED) {
      throw apiUnprocessable('EXIT_REQUEST_INVALID_STATUS', 'Exit request cannot be completed from current status', {
        exitRequestId,
        status: row.status,
      });
    }

    const effectiveOn = row.effectiveOn ?? new Date();
    const enrollmentStatus = this.exitReasonToEnrollmentStatus(row.reason);

    await this.prisma.$transaction(async (tx) => {
      // Find active enrollment and close it.
      const activeEnrollment = await tx.enrollment.findFirst({
        where: {
          tenantId: row.tenantId,
          studentId: row.studentId,
          status: EnrollmentStatus.ACTIVE,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (activeEnrollment) {
        await tx.enrollment.update({
          where: { id: activeEnrollment.id },
          data: {
            status: enrollmentStatus,
            leftOn: effectiveOn,
            updatedById: user.sub,
          },
        });
      }

      await tx.student.update({
        where: { id: row.studentId },
        data: { currentStatus: enrollmentStatus, updatedById: user.sub },
      });

      await tx.studentExitRequest.update({
        where: { id: exitRequestId },
        data: {
          status: ExitRequestStatus.COMPLETED,
          completedAt: new Date(),
          updatedById: user.sub,
        },
      });
    });

    return { success: true };
  }

  async certificate(user: AuthenticatedUser, exitRequestId: string): Promise<unknown> {
    const row = await this.getOrThrow(user, exitRequestId);
    const student = await this.prisma.student.findFirst({
      where: { id: row.studentId, tenantId: user.tenantId, deletedAt: null },
      select: {
        id: true,
        admissionNo: true,
        firstName: true,
        lastName: true,
        schoolId: true,
      },
    });
    if (!student) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId: row.studentId });
    }

    return {
      exitRequestId: row.id,
      certificate: {
        studentId: student.id,
        admissionNo: student.admissionNo,
        studentName: `${student.firstName}${student.lastName ? ` ${student.lastName}` : ''}`,
        schoolId: student.schoolId,
        reason: row.reason,
        forwardingSchoolName: row.forwardingSchoolName,
        forwardingSchoolAddress: row.forwardingSchoolAddress,
        effectiveOn: row.effectiveOn ? row.effectiveOn.toISOString().slice(0, 10) : null,
        status: row.status,
        digitallySigned: false,
      },
    };
  }

  private exitReasonToEnrollmentStatus(reason: ExitReason): EnrollmentStatus {
    if (reason === ExitReason.TRANSFER || reason === ExitReason.MIGRATION) {
      return EnrollmentStatus.TRANSFERRED;
    }
    return EnrollmentStatus.INACTIVE;
  }

  private async getOrThrow(user: AuthenticatedUser, exitRequestId: string): Promise<StudentExitRequest> {
    const row = await this.prisma.studentExitRequest.findFirst({
      where: { id: exitRequestId, tenantId: user.tenantId, deletedAt: null },
    });
    if (!row) {
      throw apiNotFound('EXIT_REQUEST_NOT_FOUND', 'Exit request not found', { exitRequestId });
    }
    return row;
  }

  private toResponse(row: StudentExitRequest): ExitRequestResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      studentId: row.studentId,
      status: row.status,
      reason: row.reason,
      forwardingSchoolName: row.forwardingSchoolName,
      forwardingSchoolAddress: row.forwardingSchoolAddress,
      notes: row.notes,
      decisionNotes: row.decisionNotes,
      requestedById: row.requestedById,
      decidedById: row.decidedById,
      effectiveOn: row.effectiveOn ? row.effectiveOn.toISOString().slice(0, 10) : null,
      requestedAt: row.requestedAt ? row.requestedAt.toISOString() : null,
      decidedAt: row.decidedAt ? row.decidedAt.toISOString() : null,
      completedAt: row.completedAt ? row.completedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  }
}

