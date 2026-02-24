import { PrismaService } from '@gps/data-access-db';
import {
  AdmissionApplication,
  AdmissionStatus,
  EnrollmentStatus,
  Gender,
} from '@gps/data-access-prisma';
import { apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { EnrollAdmissionApplicationDto } from './dto/enroll-admission-application.dto';
import { AdmissionApplicationResponseDto } from './dto/admission-application-response.dto';
import { ListAdmissionApplicationsQueryDto } from './dto/list-admission-applications-query.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async listApplications(
    user: AuthenticatedUser,
    query: ListAdmissionApplicationsQueryDto,
  ): Promise<AdmissionApplicationResponseDto[]> {
    const rows = await this.prisma.admissionApplication.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
        ...(query.status ? { status: query.status } : {}),
        ...(query.search
          ? {
              OR: [
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { guardianFirstName: { contains: query.search, mode: 'insensitive' } },
                { guardianLastName: { contains: query.search, mode: 'insensitive' } },
                { guardianPhoneE164: { contains: query.search, mode: 'insensitive' } },
                { guardianEmail: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findApplicationById(
    user: AuthenticatedUser,
    applicationId: string,
  ): Promise<AdmissionApplicationResponseDto> {
    const row = await this.prisma.admissionApplication.findFirst({
      where: { id: applicationId, tenantId: user.tenantId, deletedAt: null },
    });

    if (!row) {
      throw apiNotFound('ADMISSION_APPLICATION_NOT_FOUND', 'Admission application not found', {
        applicationId,
      });
    }

    return this.toResponse(row);
  }

  async createApplication(
    user: AuthenticatedUser,
    dto: CreateAdmissionApplicationDto,
  ): Promise<AdmissionApplicationResponseDto> {
    const status = dto.status ?? AdmissionStatus.DRAFT;
    this.assertStatusTransitionAllowed(AdmissionStatus.DRAFT, status);

    const now = new Date();
    const created = await this.prisma.admissionApplication.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        campusId: dto.campusId,
        academicYearId: dto.academicYearId,
        classRoomId: dto.classRoomId,
        status,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender ?? Gender.UNDISCLOSED,
        dateOfBirth: new Date(dto.dateOfBirth),
        guardianFirstName: dto.guardianFirstName,
        guardianLastName: dto.guardianLastName,
        guardianPhoneE164: dto.guardianPhoneE164,
        guardianEmail: dto.guardianEmail,
        relationType: dto.relationType,
        notes: dto.notes,
        ...(status !== AdmissionStatus.DRAFT ? { submittedAt: now } : {}),
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toResponse(created);
  }

  async updateApplication(
    user: AuthenticatedUser,
    applicationId: string,
    dto: UpdateAdmissionApplicationDto,
  ): Promise<AdmissionApplicationResponseDto> {
    const existing = await this.prisma.admissionApplication.findFirst({
      where: { id: applicationId, tenantId: user.tenantId, deletedAt: null },
    });

    if (!existing) {
      throw apiNotFound('ADMISSION_APPLICATION_NOT_FOUND', 'Admission application not found', {
        applicationId,
      });
    }

    const now = new Date();

    if (dto.status !== undefined && dto.status !== existing.status) {
      this.assertStatusTransitionAllowed(existing.status, dto.status);
    }

    const updated = await this.prisma.admissionApplication.update({
      where: { id: applicationId },
      data: {
        ...(dto.schoolId !== undefined ? { schoolId: dto.schoolId } : {}),
        ...(dto.campusId !== undefined ? { campusId: dto.campusId } : {}),
        ...(dto.academicYearId !== undefined ? { academicYearId: dto.academicYearId } : {}),
        ...(dto.classRoomId !== undefined ? { classRoomId: dto.classRoomId } : {}),
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
        ...(dto.dateOfBirth !== undefined ? { dateOfBirth: new Date(dto.dateOfBirth) } : {}),
        ...(dto.guardianFirstName !== undefined
          ? { guardianFirstName: dto.guardianFirstName }
          : {}),
        ...(dto.guardianLastName !== undefined
          ? { guardianLastName: dto.guardianLastName }
          : {}),
        ...(dto.guardianPhoneE164 !== undefined
          ? { guardianPhoneE164: dto.guardianPhoneE164 }
          : {}),
        ...(dto.guardianEmail !== undefined ? { guardianEmail: dto.guardianEmail } : {}),
        ...(dto.relationType !== undefined ? { relationType: dto.relationType } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
        ...(dto.status !== undefined
          ? {
              status: dto.status,
              ...(dto.status !== AdmissionStatus.DRAFT && !existing.submittedAt
                ? { submittedAt: now }
                : {}),
              ...(dto.status === AdmissionStatus.REVIEWING && !existing.reviewedAt
                ? { reviewedAt: now }
                : {}),
              ...(dto.status === AdmissionStatus.APPROVED || dto.status === AdmissionStatus.REJECTED
                ? { decidedAt: now }
                : {}),
            }
          : {}),
        updatedById: user.sub,
      },
    });

    return this.toResponse(updated);
  }

  async enroll(
    user: AuthenticatedUser,
    applicationId: string,
    dto: EnrollAdmissionApplicationDto,
  ): Promise<{ success: true; studentId: string }> {
    const application = await this.prisma.admissionApplication.findFirst({
      where: { id: applicationId, tenantId: user.tenantId, deletedAt: null },
    });

    if (!application) {
      throw apiNotFound('ADMISSION_APPLICATION_NOT_FOUND', 'Admission application not found', {
        applicationId,
      });
    }

    if (application.studentId) {
      throw apiUnprocessable(
        'ADMISSION_ALREADY_ENROLLED',
        'Admission application is already enrolled',
        { applicationId, studentId: application.studentId },
      );
    }

    const classRoomId = dto.classRoomId ?? application.classRoomId;
    if (!classRoomId) {
      throw apiUnprocessable(
        'ADMISSION_CLASSROOM_REQUIRED',
        'classRoomId is required to enroll an application',
        { applicationId },
      );
    }

    const now = new Date();
    const joinedOn = dto.joinedOn ? new Date(dto.joinedOn) : null;

    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const student = await tx.student.create({
          data: {
            tenantId: user.tenantId,
            schoolId: application.schoolId,
            campusId: application.campusId,
            admissionNo: dto.admissionNo,
            firstName: application.firstName,
            lastName: application.lastName,
            gender: application.gender,
            dateOfBirth: application.dateOfBirth,
            joinedOn,
            currentStatus: EnrollmentStatus.ACTIVE,
            createdById: user.sub,
            updatedById: user.sub,
          },
        });

        const guardian = await tx.guardian.create({
          data: {
            tenantId: user.tenantId,
            schoolId: application.schoolId,
            firstName: application.guardianFirstName,
            lastName: application.guardianLastName,
            phoneE164: application.guardianPhoneE164,
            email: application.guardianEmail,
            relationNote: application.relationType,
            createdById: user.sub,
            updatedById: user.sub,
          },
        });

        await tx.studentGuardian.create({
          data: {
            tenantId: user.tenantId,
            studentId: student.id,
            guardianId: guardian.id,
            relationType: application.relationType,
            isPrimary: true,
            createdById: user.sub,
            updatedById: user.sub,
          },
        });

        if (dto.createEnrollment !== false) {
          await tx.enrollment.create({
            data: {
              tenantId: user.tenantId,
              studentId: student.id,
              classRoomId,
              academicYearId: application.academicYearId,
              status: EnrollmentStatus.ACTIVE,
              enrolledOn: joinedOn ?? now,
              createdById: user.sub,
              updatedById: user.sub,
            },
          });
        }

        await tx.admissionApplication.update({
          where: { id: applicationId },
          data: {
            status: AdmissionStatus.ENROLLED,
            studentId: student.id,
            decidedAt: application.decidedAt ?? now,
            updatedById: user.sub,
          },
        });

        return student;
      });

      return { success: true, studentId: created.id };
    } catch (err) {
      if (this.isUniqueConstraintError(err, ['schoolId', 'admissionNo'])) {
        throw apiConflict('STUDENT_ADMISSION_NO_CONFLICT', 'Admission number already exists', {
          schoolId: application.schoolId,
          admissionNo: dto.admissionNo,
        });
      }
      throw err;
    }
  }

  private assertStatusTransitionAllowed(from: AdmissionStatus, to: AdmissionStatus) {
    const allowed: Record<AdmissionStatus, AdmissionStatus[]> = {
      [AdmissionStatus.DRAFT]: [
        AdmissionStatus.DRAFT,
        AdmissionStatus.SUBMITTED,
        AdmissionStatus.WITHDRAWN,
      ],
      [AdmissionStatus.SUBMITTED]: [
        AdmissionStatus.REVIEWING,
        AdmissionStatus.APPROVED,
        AdmissionStatus.REJECTED,
        AdmissionStatus.WITHDRAWN,
      ],
      [AdmissionStatus.REVIEWING]: [
        AdmissionStatus.APPROVED,
        AdmissionStatus.REJECTED,
        AdmissionStatus.WITHDRAWN,
      ],
      [AdmissionStatus.APPROVED]: [AdmissionStatus.ENROLLED, AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.REJECTED]: [AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.ENROLLED]: [],
      [AdmissionStatus.WITHDRAWN]: [],
    };

    if (!allowed[from].includes(to)) {
      throw apiUnprocessable('ADMISSION_STATUS_INVALID_TRANSITION', 'Invalid admission status transition', {
        from,
        to,
      });
    }
  }

  private toResponse(row: AdmissionApplication): AdmissionApplicationResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      campusId: row.campusId,
      academicYearId: row.academicYearId,
      classRoomId: row.classRoomId,
      studentId: row.studentId,
      status: row.status,
      firstName: row.firstName,
      lastName: row.lastName,
      gender: row.gender,
      dateOfBirth: row.dateOfBirth.toISOString(),
      guardianFirstName: row.guardianFirstName,
      guardianLastName: row.guardianLastName,
      guardianPhoneE164: row.guardianPhoneE164,
      guardianEmail: row.guardianEmail,
      relationType: row.relationType,
      notes: row.notes,
      submittedAt: row.submittedAt ? row.submittedAt.toISOString() : null,
      reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
      decidedAt: row.decidedAt ? row.decidedAt.toISOString() : null,
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
