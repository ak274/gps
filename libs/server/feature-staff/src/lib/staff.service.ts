import { PrismaService } from '@gps/data-access-db';
import { StaffProfile, TeacherProfile } from '@gps/data-access-prisma';
import { apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ListStaffQueryDto } from './dto/list-staff-query.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

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
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toTeacherResponse(row));
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

  private toTeacherResponse(row: TeacherProfile): TeacherResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      staffProfileId: row.staffProfileId,
      specialization: row.specialization,
      experienceYears: row.experienceYears,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
