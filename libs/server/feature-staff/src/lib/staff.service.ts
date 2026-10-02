import { PrismaService } from '@gps/data-access-db';
import {
  MembershipStatus,
  StaffProfile,
  TeacherProfile,
  UserStatus,
} from '@gps/data-access-prisma';
import { apiBadRequest, apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { parse } from 'csv-parse/sync';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ListStaffQueryDto } from './dto/list-staff-query.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { StaffImportCsvDto } from './dto/staff-import-csv.dto';
import {
  StaffImportCommitDto,
  StaffImportCommitResponseDto,
  StaffImportErrorDto,
  StaffImportPreviewResponseDto,
  StaffImportRecordDto,
} from './dto/staff-import-response.dto';

type TeacherWithName = TeacherProfile & {
  staffProfile: { user: { firstName: string; lastName: string | null } };
};

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async listStaff(user: AuthenticatedUser, query: ListStaffQueryDto): Promise<StaffResponseDto[]> {
    const rows = await this.prisma.staffProfile.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.search
          ? {
              OR: [
                { employeeCode: { contains: query.search, mode: 'insensitive' } },
                { designation: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toStaffResponse(row));
  }

  async findStaffById(user: AuthenticatedUser, staffId: string): Promise<StaffResponseDto> {
    const row = await this.prisma.staffProfile.findFirst({
      where: { id: staffId, tenantId: user.tenantId, deletedAt: null },
    });

    if (!row) {
      throw apiNotFound('STAFF_PROFILE_NOT_FOUND', 'Staff profile not found', { staffId });
    }

    return this.toStaffResponse(row);
  }

  async createStaff(user: AuthenticatedUser, dto: CreateStaffDto): Promise<StaffResponseDto> {
    const [employeeCodeDuplicate, schoolUserDuplicate] = await Promise.all([
      this.prisma.staffProfile.findFirst({
        where: {
          tenantId: user.tenantId,
          employeeCode: dto.employeeCode,
          deletedAt: null,
        },
        select: { id: true },
      }),
      this.prisma.staffProfile.findFirst({
        where: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          userId: dto.userId,
          deletedAt: null,
        },
        select: { id: true },
      }),
    ]);

    if (employeeCodeDuplicate) {
      throw apiConflict('STAFF_EMPLOYEE_CODE_CONFLICT', 'Employee code already exists', {
        employeeCode: dto.employeeCode,
      });
    }

    if (schoolUserDuplicate) {
      throw apiConflict(
        'STAFF_SCHOOL_USER_CONFLICT',
        'Staff profile already exists for this school user',
        {
          schoolId: dto.schoolId,
          userId: dto.userId,
        },
      );
    }

    const row = await this.prisma.staffProfile.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        campusId: dto.campusId,
        userId: dto.userId,
        employeeCode: dto.employeeCode,
        designation: dto.designation,
        employmentType: dto.employmentType,
        joinedOn: dto.joinedOn ? new Date(dto.joinedOn) : null,
        profilePhotoKey: dto.profilePhotoKey,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toStaffResponse(row);
  }

  async updateStaff(
    user: AuthenticatedUser,
    staffId: string,
    dto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    await this.ensureStaff(user, staffId);

    const row = await this.prisma.staffProfile.update({
      where: { id: staffId },
      data: {
        ...(dto.designation !== undefined ? { designation: dto.designation } : {}),
        ...(dto.employmentType !== undefined ? { employmentType: dto.employmentType } : {}),
        ...(dto.joinedOn !== undefined ? { joinedOn: new Date(dto.joinedOn) } : {}),
        ...(dto.profilePhotoKey !== undefined ? { profilePhotoKey: dto.profilePhotoKey } : {}),
        updatedById: user.sub,
      },
    });

    return this.toStaffResponse(row);
  }

  async listTeachers(user: AuthenticatedUser): Promise<TeacherResponseDto[]> {
    const rows = await this.prisma.teacherProfile.findMany({
      where: { tenantId: user.tenantId, deletedAt: null },
      include: { staffProfile: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toTeacherResponse(row as TeacherWithName));
  }

  async findTeacherById(user: AuthenticatedUser, teacherId: string): Promise<TeacherResponseDto> {
    const row = await this.prisma.teacherProfile.findFirst({
      where: { id: teacherId, tenantId: user.tenantId, deletedAt: null },
    });

    if (!row) {
      throw apiNotFound('TEACHER_PROFILE_NOT_FOUND', 'Teacher profile not found', { teacherId });
    }

    return this.toTeacherResponse(row);
  }

  async createTeacher(user: AuthenticatedUser, dto: CreateTeacherDto): Promise<TeacherResponseDto> {
    const staff = await this.prisma.staffProfile.findFirst({
      where: {
        id: dto.staffProfileId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!staff) {
      throw apiNotFound('STAFF_PROFILE_NOT_FOUND', 'Staff profile not found', {
        staffProfileId: dto.staffProfileId,
      });
    }

    const existing = await this.prisma.teacherProfile.findFirst({
      where: {
        tenantId: user.tenantId,
        staffProfileId: dto.staffProfileId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (existing) {
      throw apiConflict(
        'TEACHER_STAFF_PROFILE_CONFLICT',
        'Teacher profile already exists for this staff profile',
        {
          staffProfileId: dto.staffProfileId,
        },
      );
    }

    const row = await this.prisma.teacherProfile.create({
      data: {
        tenantId: user.tenantId,
        staffProfileId: dto.staffProfileId,
        specialization: dto.specialization,
        experienceYears: dto.experienceYears,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    return this.toTeacherResponse(row);
  }

  async previewImportCsv(
    user: AuthenticatedUser,
    dto: StaffImportCsvDto,
    file?: Express.Multer.File,
  ): Promise<StaffImportPreviewResponseDto> {
    const rows = await this.parseImportRows(file);
    const records = this.normalizeImportRows(rows);
    await this.ensureImportScope(user, dto);

    const existingStaff = await this.prisma.staffProfile.findMany({
      where: { tenantId: user.tenantId, schoolId: dto.schoolId, deletedAt: null },
      select: { employeeCode: true, user: { select: { email: true } } },
    });
    const existingCodes = new Set(existingStaff.map((row) => row.employeeCode.toLowerCase()));
    const existingEmails = new Set(existingStaff.map((row) => row.user.email.toLowerCase()));
    const seenCodes = new Map<string, number>();
    const seenEmails = new Map<string, number>();
    const errors: StaffImportErrorDto[] = [];
    const validRecords: StaffImportRecordDto[] = [];

    records.forEach((record, rowIndex) => {
      const rowErrors: StaffImportErrorDto[] = [];
      const email = record.email.toLowerCase();
      const employeeCode = record.employeeCode.toLowerCase();

      if (!record.email || !record.firstName || !record.employeeCode) {
        rowErrors.push({
          rowIndex,
          code: 'REQUIRED_FIELD_MISSING',
          message: 'Email, first name and employee code are required',
          details: { email: record.email, employeeCode: record.employeeCode },
        });
      }
      if (record.email && !/^\S+@\S+\.\S+$/.test(record.email)) {
        rowErrors.push({
          rowIndex,
          code: 'INVALID_EMAIL',
          message: 'Email address is invalid',
          details: { email: record.email },
        });
      }
      if (seenCodes.has(employeeCode)) {
        rowErrors.push({
          rowIndex,
          code: 'DUPLICATE_EMPLOYEE_CODE',
          message: 'Employee code is repeated in this file',
          details: { firstRowIndex: seenCodes.get(employeeCode), employeeCode: record.employeeCode },
        });
      }
      if (seenEmails.has(email)) {
        rowErrors.push({
          rowIndex,
          code: 'DUPLICATE_EMAIL',
          message: 'Email is repeated in this file',
          details: { firstRowIndex: seenEmails.get(email), email: record.email },
        });
      }
      if (existingCodes.has(employeeCode)) {
        rowErrors.push({
          rowIndex,
          code: 'EMPLOYEE_CODE_EXISTS',
          message: 'Employee code already exists in this school',
          details: { employeeCode: record.employeeCode },
        });
      }
      if (existingEmails.has(email)) {
        rowErrors.push({
          rowIndex,
          code: 'STAFF_EMAIL_EXISTS',
          message: 'This email already has a staff profile in this school',
          details: { email: record.email },
        });
      }
      if (record.employeeCode) seenCodes.set(employeeCode, rowIndex);
      if (record.email) seenEmails.set(email, rowIndex);

      if (rowErrors.length > 0) errors.push(...rowErrors);
      else validRecords.push(record);
    });

    return {
      totalRows: records.length,
      validRows: validRecords.length,
      invalidRows: records.length - validRecords.length,
      records: validRecords,
      errors,
    };
  }

  async commitImport(
    user: AuthenticatedUser,
    dto: StaffImportCsvDto,
    input: StaffImportCommitDto,
  ): Promise<StaffImportCommitResponseDto> {
    await this.ensureImportScope(user, dto);
    if (input.records.length === 0) {
      throw apiUnprocessable('STAFF_IMPORT_EMPTY', 'At least one reviewed staff record is required');
    }

    const staffRole = await this.prisma.role.findFirst({
      where: { tenantId: user.tenantId, key: 'staff', deletedAt: null },
      select: { id: true },
    });
    if (!staffRole) {
      throw apiBadRequest('STAFF_ROLE_NOT_CONFIGURED', 'The staff role is not configured for this institution');
    }

    let createdCount = 0;
    let invitedCount = 0;
    const errors: StaffImportErrorDto[] = [];

    for (let rowIndex = 0; rowIndex < input.records.length; rowIndex += 1) {
      const record = input.records[rowIndex];
      try {
        await this.prisma.$transaction(async (tx) => {
          const email = record.email.toLowerCase();
          const existingUser = await tx.user.findUnique({ where: { email } });
          const invited = !existingUser;
          const staffUser =
            existingUser ??
            (await tx.user.create({
              data: {
                email,
                firstName: record.firstName,
                lastName: record.lastName,
                status: UserStatus.INVITED,
                createdById: user.sub,
                updatedById: user.sub,
              },
            }));
          const membership = await tx.userTenant.upsert({
            where: { tenantId_userId: { tenantId: user.tenantId, userId: staffUser.id } },
            create: {
              tenantId: user.tenantId,
              userId: staffUser.id,
              status: MembershipStatus.INVITED,
              createdById: user.sub,
              updatedById: user.sub,
            },
            update: { deletedAt: null, deletedById: null, updatedById: user.sub },
          });
          await tx.userRoleAssignment.upsert({
            where: { userTenantId_roleId: { userTenantId: membership.id, roleId: staffRole.id } },
            create: { userTenantId: membership.id, roleId: staffRole.id, createdById: user.sub, updatedById: user.sub },
            update: { deletedAt: null, deletedById: null, updatedById: user.sub },
          });
          await tx.staffProfile.create({
            data: {
              tenantId: user.tenantId,
              schoolId: dto.schoolId,
              campusId: dto.campusId,
              userId: staffUser.id,
              employeeCode: record.employeeCode,
              designation: record.designation,
              employmentType: record.employmentType,
              joinedOn: record.joinedOn ? new Date(record.joinedOn) : null,
              createdById: user.sub,
              updatedById: user.sub,
            },
          });
          if (invited) invitedCount += 1;
          createdCount += 1;
        });
      } catch (error) {
        errors.push({
          rowIndex,
          code: 'IMPORT_COMMIT_FAILED',
          message: error instanceof Error ? error.message : 'Unable to commit staff record',
          details: { email: record.email, employeeCode: record.employeeCode },
        });
      }
    }

    return { createdCount, invitedCount, errors };
  }

  private async parseImportRows(file?: Express.Multer.File): Promise<Array<Record<string, string>>> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw apiUnprocessable('STAFF_IMPORT_FILE_MISSING', 'CSV file is required');
    }
    const text = file.buffer.toString('utf8');
    return parse(text, { columns: true, skip_empty_lines: true, trim: true }) as Array<Record<string, string>>;
  }

  private normalizeImportRows(rows: Array<Record<string, string>>): StaffImportRecordDto[] {
    return rows.map((row) => ({
      email: row.email?.trim().toLowerCase() ?? '',
      firstName: row.firstName?.trim() ?? '',
      lastName: row.lastName?.trim() || null,
      employeeCode: row.employeeCode?.trim() ?? '',
      designation: row.designation?.trim() || null,
      employmentType: row.employmentType?.trim() || null,
      joinedOn: row.joinedOn?.trim() || null,
    }));
  }

  private async ensureImportScope(user: AuthenticatedUser, dto: StaffImportCsvDto): Promise<void> {
    const school = await this.prisma.school.findFirst({
      where: { id: dto.schoolId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!school) throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found in your institution');
    if (!dto.campusId) return;
    const campus = await this.prisma.campus.findFirst({
      where: { id: dto.campusId, schoolId: dto.schoolId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!campus) throw apiNotFound('CAMPUS_NOT_FOUND', 'Campus does not belong to the selected school');
  }

  async updateTeacher(
    user: AuthenticatedUser,
    teacherId: string,
    dto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    await this.ensureTeacher(user, teacherId);

    const row = await this.prisma.teacherProfile.update({
      where: { id: teacherId },
      data: {
        ...(dto.specialization !== undefined ? { specialization: dto.specialization } : {}),
        ...(dto.experienceYears !== undefined ? { experienceYears: dto.experienceYears } : {}),
        updatedById: user.sub,
      },
    });

    return this.toTeacherResponse(row);
  }

  private async ensureStaff(user: AuthenticatedUser, staffId: string): Promise<void> {
    const row = await this.prisma.staffProfile.findFirst({
      where: { id: staffId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });

    if (!row) {
      throw apiNotFound('STAFF_PROFILE_NOT_FOUND', 'Staff profile not found', { staffId });
    }
  }

  private async ensureTeacher(user: AuthenticatedUser, teacherId: string): Promise<void> {
    const row = await this.prisma.teacherProfile.findFirst({
      where: { id: teacherId, tenantId: user.tenantId, deletedAt: null },
      select: { id: true },
    });

    if (!row) {
      throw apiNotFound('TEACHER_PROFILE_NOT_FOUND', 'Teacher profile not found', { teacherId });
    }
  }

  private toStaffResponse(row: StaffProfile): StaffResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      campusId: row.campusId,
      userId: row.userId,
      employeeCode: row.employeeCode,
      designation: row.designation,
      employmentType: row.employmentType,
      joinedOn: row.joinedOn ? row.joinedOn.toISOString() : null,
      profilePhotoKey: row.profilePhotoKey,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private toTeacherResponse(row: TeacherProfile | TeacherWithName): TeacherResponseDto {
    const staffProfile = (row as Partial<TeacherWithName>).staffProfile;
    return {
      id: row.id,
      tenantId: row.tenantId,
      staffProfileId: row.staffProfileId,
      firstName: staffProfile?.user.firstName ?? '',
      lastName: staffProfile?.user.lastName ?? null,
      specialization: row.specialization,
      experienceYears: row.experienceYears,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
