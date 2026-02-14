import { PrismaService } from '@gps/data-access-db';
import { Guardian, Student, StudentGuardian } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { GuardianResponseDto } from './dto/guardian-response.dto';
import { LinkStudentGuardianDto } from './dto/link-student-guardian.dto';
import { ListGuardiansQueryDto } from './dto/list-guardians-query.dto';
import { StudentGuardianLinkResponseDto } from './dto/student-guardian-link-response.dto';
import { StudentSummaryResponseDto } from './dto/student-summary-response.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';

@Injectable()
export class GuardiansService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListGuardiansQueryDto): Promise<GuardianResponseDto[]> {
    const rows = await this.prisma.guardian.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.search
          ? {
              OR: [
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { phoneE164: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ firstName: 'asc' }, { createdAt: 'desc' }],
    });

    return rows.map((row) => this.toGuardianResponse(row));
  }

  async findById(user: AuthenticatedUser, guardianId: string): Promise<GuardianResponseDto> {
    const row = await this.prisma.guardian.findFirst({
      where: {
        id: guardianId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('GUARDIAN_NOT_FOUND', 'Guardian not found', { guardianId });
    }

    return this.toGuardianResponse(row);
  }

  async create(user: AuthenticatedUser, dto: CreateGuardianDto): Promise<GuardianResponseDto> {
    if (dto.userId) {
      const duplicate = await this.prisma.guardian.findFirst({
        where: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          userId: dto.userId,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (duplicate) {
        throw apiConflict(
          'GUARDIAN_USER_CONFLICT',
          'Guardian profile already exists for this school user',
          { schoolId: dto.schoolId, userId: dto.userId },
        );
      }
    }

    const row = await this.prisma.guardian.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        userId: dto.userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneE164: dto.phoneE164,
        email: dto.email,
        occupation: dto.occupation,
        relationNote: dto.relationNote,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toGuardianResponse(row);
  }

  async update(
    user: AuthenticatedUser,
    guardianId: string,
    dto: UpdateGuardianDto,
  ): Promise<GuardianResponseDto> {
    await this.ensureGuardian(user, guardianId);

    const row = await this.prisma.guardian.update({
      where: { id: guardianId },
      data: {
        ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
        ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
        ...(dto.phoneE164 !== undefined ? { phoneE164: dto.phoneE164 } : {}),
        ...(dto.email !== undefined ? { email: dto.email } : {}),
        ...(dto.occupation !== undefined ? { occupation: dto.occupation } : {}),
        ...(dto.relationNote !== undefined ? { relationNote: dto.relationNote } : {}),
        updatedById: user.sub,
      },
    });

    return this.toGuardianResponse(row);
  }

  async linkStudent(
    user: AuthenticatedUser,
    guardianId: string,
    studentId: string,
    dto: LinkStudentGuardianDto,
  ): Promise<StudentGuardianLinkResponseDto> {
    const [guardian, student] = await Promise.all([
      this.prisma.guardian.findFirst({
        where: { id: guardianId, tenantId: user.tenantId, deletedAt: null },
        select: { id: true, schoolId: true },
      }),
      this.prisma.student.findFirst({
        where: { id: studentId, tenantId: user.tenantId, deletedAt: null },
        select: { id: true, schoolId: true },
      }),
    ]);

    if (!guardian) {
      throw apiNotFound('GUARDIAN_NOT_FOUND', 'Guardian not found', { guardianId });
    }
    if (!student) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId });
    }
    if (guardian.schoolId !== student.schoolId) {
      throw apiConflict(
        'GUARDIAN_STUDENT_SCHOOL_MISMATCH',
        'Guardian and student must belong to the same school',
        { guardianId, studentId },
      );
    }

    const duplicate = await this.prisma.studentGuardian.findFirst({
      where: {
        tenantId: user.tenantId,
        guardianId,
        studentId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (duplicate) {
      throw apiConflict('STUDENT_GUARDIAN_LINK_CONFLICT', 'Student guardian link already exists', {
        guardianId,
        studentId,
      });
    }

    if (dto.isPrimary === true) {
      await this.prisma.studentGuardian.updateMany({
        where: {
          tenantId: user.tenantId,
          studentId,
          isPrimary: true,
          deletedAt: null,
        },
        data: {
          isPrimary: false,
          updatedById: user.sub,
        },
      });
    }

    const row = await this.prisma.studentGuardian.create({
      data: {
        tenantId: user.tenantId,
        guardianId,
        studentId,
        relationType: dto.relationType,
        isPrimary: dto.isPrimary ?? false,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toLinkResponse(row);
  }

  async unlinkStudent(
    user: AuthenticatedUser,
    guardianId: string,
    studentId: string,
  ): Promise<{ success: true }> {
    const link = await this.prisma.studentGuardian.findFirst({
      where: {
        tenantId: user.tenantId,
        guardianId,
        studentId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!link) {
      throw apiNotFound('STUDENT_GUARDIAN_LINK_NOT_FOUND', 'Student guardian link not found', {
        guardianId,
        studentId,
      });
    }

    await this.prisma.studentGuardian.update({
      where: { id: link.id },
      data: {
        deletedAt: new Date(),
        deletedById: user.sub,
        updatedById: user.sub,
      },
    });

    return { success: true };
  }

  async listStudentGuardians(
    user: AuthenticatedUser,
    studentId: string,
  ): Promise<GuardianResponseDto[]> {
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!student) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId });
    }

    const links = await this.prisma.studentGuardian.findMany({
      where: {
        tenantId: user.tenantId,
        studentId,
        deletedAt: null,
      },
      include: {
        guardian: true,
      },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'desc' }],
    });

    return links
      .filter((row) => row.guardian.deletedAt === null)
      .map((row) => this.toGuardianResponse(row.guardian));
  }

  async listSiblingsByStudent(
    user: AuthenticatedUser,
    studentId: string,
  ): Promise<StudentSummaryResponseDto[]> {
    const student = await this.prisma.student.findFirst({
      where: {
        id: studentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!student) {
      throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId });
    }

    const guardianLinks = await this.prisma.studentGuardian.findMany({
      where: {
        tenantId: user.tenantId,
        studentId,
        deletedAt: null,
      },
      select: { guardianId: true },
    });

    const guardianIds = guardianLinks.map((row) => row.guardianId);
    if (guardianIds.length === 0) {
      return [];
    }

    const siblingLinks = await this.prisma.studentGuardian.findMany({
      where: {
        tenantId: user.tenantId,
        guardianId: { in: guardianIds },
        studentId: { not: studentId },
        deletedAt: null,
      },
      include: {
        student: true,
      },
    });

    const dedup = new Map<string, Student>();
    for (const link of siblingLinks) {
      if (link.student.deletedAt !== null) {
        continue;
      }
      dedup.set(link.student.id, link.student);
    }

    return Array.from(dedup.values())
      .sort((a, b) => a.firstName.localeCompare(b.firstName))
      .map((row) => ({
        id: row.id,
        schoolId: row.schoolId,
        admissionNo: row.admissionNo,
        firstName: row.firstName,
        lastName: row.lastName,
        gender: row.gender,
        currentStatus: row.currentStatus,
      }));
  }

  private async ensureGuardian(user: AuthenticatedUser, guardianId: string): Promise<void> {
    const row = await this.prisma.guardian.findFirst({
      where: {
        id: guardianId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!row) {
      throw apiNotFound('GUARDIAN_NOT_FOUND', 'Guardian not found', { guardianId });
    }
  }

  private toGuardianResponse(row: Guardian): GuardianResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      userId: row.userId,
      firstName: row.firstName,
      lastName: row.lastName,
      phoneE164: row.phoneE164,
      email: row.email,
      occupation: row.occupation,
      relationNote: row.relationNote,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private toLinkResponse(row: StudentGuardian): StudentGuardianLinkResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      studentId: row.studentId,
      guardianId: row.guardianId,
      relationType: row.relationType,
      isPrimary: row.isPrimary,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
