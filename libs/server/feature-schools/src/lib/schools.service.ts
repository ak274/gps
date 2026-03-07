import { PrismaService } from '@gps/data-access-db';
import {
  Campus,
  MembershipStatus,
  School,
  UserTenantSchoolAssignment,
} from '@gps/data-access-prisma';
import { apiBadRequest, apiConflict, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AssignSchoolAdminDto } from './dto/assign-school-admin.dto';
import { CampusResponseDto } from './dto/campus-response.dto';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CreateCampusDto } from './dto/create-campus.dto';
import { ListAdminAssignmentsQueryDto } from './dto/list-admin-assignments-query.dto';
import { ListCampusesQueryDto } from './dto/list-campuses-query.dto';
import { ListSchoolsQueryDto } from './dto/list-schools-query.dto';
import { SchoolResponseDto } from './dto/school-response.dto';
import { SchoolAdminAssignmentResponseDto } from './dto/school-admin-assignment-response.dto';
import { UpdateCampusDto } from './dto/update-campus.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, query: ListSchoolsQueryDto): Promise<SchoolResponseDto[]> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const rows = await this.prisma.school.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolIds ? { id: { in: schoolIds } } : {}),
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ name: 'asc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, schoolId: string): Promise<SchoolResponseDto> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const school = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolIds ? { id: { in: schoolIds } } : {}),
      },
    });

    if (!school) {
      throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId });
    }

    return this.toResponse(school);
  }

  async create(user: AuthenticatedUser, dto: CreateSchoolDto): Promise<SchoolResponseDto> {
    const exists = await this.prisma.school.findFirst({
      where: {
        tenantId: user.tenantId,
        code: dto.code,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (exists) {
      throw apiConflict(
        'SCHOOL_CODE_CONFLICT',
        'School code already exists in this tenant',
        { code: dto.code },
      );
    }

    const school = await this.prisma.school.create({
      data: {
        tenantId: user.tenantId,
        code: dto.code,
        name: dto.name,
        board: dto.board,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
      },
    });

    return this.toResponse(school);
  }

  async update(
    user: AuthenticatedUser,
    schoolId: string,
    dto: UpdateSchoolDto,
  ): Promise<SchoolResponseDto> {
    const existing = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId });
    }

    const updated = await this.prisma.school.update({
      where: { id: schoolId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.board !== undefined ? { board: dto.board } : {}),
        ...(dto.contactEmail !== undefined ? { contactEmail: dto.contactEmail } : {}),
        ...(dto.contactPhone !== undefined ? { contactPhone: dto.contactPhone } : {}),
      },
    });

    return this.toResponse(updated);
  }

  async listCampuses(
    user: AuthenticatedUser,
    query: ListCampusesQueryDto,
  ): Promise<CampusResponseDto[]> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const rows = await this.prisma.campus.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(schoolIds ? { schoolId: { in: schoolIds } } : {}),
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: 'insensitive' } },
                { name: { contains: query.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ name: 'asc' }],
    });

    return rows.map((row) => this.toCampusResponse(row));
  }

  async findCampusById(user: AuthenticatedUser, campusId: string): Promise<CampusResponseDto> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const campus = await this.prisma.campus.findFirst({
      where: {
        id: campusId,
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolIds ? { schoolId: { in: schoolIds } } : {}),
      },
    });

    if (!campus) {
      throw apiNotFound('CAMPUS_NOT_FOUND', 'Campus not found', { campusId });
    }

    return this.toCampusResponse(campus);
  }

  async createCampus(user: AuthenticatedUser, dto: CreateCampusDto): Promise<CampusResponseDto> {
    await this.ensureSchoolAccessible(user, dto.schoolId);

    const exists = await this.prisma.campus.findFirst({
      where: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        code: dto.code,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (exists) {
      throw apiConflict(
        'CAMPUS_CODE_CONFLICT',
        'Campus code already exists in this school',
        { schoolId: dto.schoolId, code: dto.code },
      );
    }

    const campus = await this.prisma.campus.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        code: dto.code,
        name: dto.name,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
      },
    });

    return this.toCampusResponse(campus);
  }

  async updateCampus(
    user: AuthenticatedUser,
    campusId: string,
    dto: UpdateCampusDto,
  ): Promise<CampusResponseDto> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const existing = await this.prisma.campus.findFirst({
      where: {
        id: campusId,
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolIds ? { schoolId: { in: schoolIds } } : {}),
      },
    });

    if (!existing) {
      throw apiNotFound('CAMPUS_NOT_FOUND', 'Campus not found', { campusId });
    }

    const updated = await this.prisma.campus.update({
      where: { id: campusId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.addressLine1 !== undefined ? { addressLine1: dto.addressLine1 } : {}),
        ...(dto.addressLine2 !== undefined ? { addressLine2: dto.addressLine2 } : {}),
        ...(dto.city !== undefined ? { city: dto.city } : {}),
        ...(dto.state !== undefined ? { state: dto.state } : {}),
        ...(dto.postalCode !== undefined ? { postalCode: dto.postalCode } : {}),
      },
    });

    return this.toCampusResponse(updated);
  }

  async listAdminAssignments(
    user: AuthenticatedUser,
    query: ListAdminAssignmentsQueryDto,
  ): Promise<SchoolAdminAssignmentResponseDto[]> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const rows = await this.prisma.userTenantSchoolAssignment.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
        ...(query.userTenantId ? { userTenantId: query.userTenantId } : {}),
        ...(schoolIds ? { schoolId: { in: schoolIds } } : {}),
      },
      include: {
        school: true,
        userTenant: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((row) => this.toSchoolAdminAssignmentResponse(row));
  }

  async assignAdminToSchool(
    user: AuthenticatedUser,
    dto: AssignSchoolAdminDto,
  ): Promise<SchoolAdminAssignmentResponseDto> {
    await this.ensureSchoolAccessible(user, dto.schoolId);

    const membership = await this.prisma.userTenant.findFirst({
      where: {
        id: dto.userTenantId,
        tenantId: user.tenantId,
        status: {
          in: [MembershipStatus.ACTIVE, MembershipStatus.INVITED],
        },
        deletedAt: null,
      },
      include: {
        roleAssignments: {
          where: { deletedAt: null },
          include: { role: true },
        },
      },
    });

    if (!membership) {
      throw apiNotFound('SCHOOL_ADMIN_MEMBERSHIP_NOT_FOUND', 'Tenant membership not found', {
        userTenantId: dto.userTenantId,
      });
    }

    const roleKeys = new Set(
      membership.roleAssignments.map((assignment) => assignment.role.key.toLowerCase()),
    );
    const isAdminMembership =
      roleKeys.has('admin') || roleKeys.has('tenant_admin') || roleKeys.has('school_admin');
    if (!isAdminMembership) {
      throw apiBadRequest(
        'SCHOOL_ADMIN_ROLE_REQUIRED',
        'Membership must have an admin role before school assignment',
        { userTenantId: dto.userTenantId },
      );
    }

    const row = await this.prisma.userTenantSchoolAssignment.upsert({
      where: {
        userTenantId_schoolId: {
          userTenantId: dto.userTenantId,
          schoolId: dto.schoolId,
        },
      },
      create: {
        tenantId: user.tenantId,
        userTenantId: dto.userTenantId,
        schoolId: dto.schoolId,
        canManageAllCampuses: dto.canManageAllCampuses ?? true,
        createdById: user.sub,
        updatedById: user.sub,
      },
      update: {
        canManageAllCampuses: dto.canManageAllCampuses ?? true,
        deletedAt: null,
        deletedById: null,
        updatedById: user.sub,
      },
      include: {
        school: true,
        userTenant: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.toSchoolAdminAssignmentResponse(row);
  }

  async revokeAdminAssignment(
    user: AuthenticatedUser,
    assignmentId: string,
  ): Promise<SchoolAdminAssignmentResponseDto> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const existing = await this.prisma.userTenantSchoolAssignment.findFirst({
      where: {
        id: assignmentId,
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolIds ? { schoolId: { in: schoolIds } } : {}),
      },
      include: {
        school: true,
        userTenant: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existing) {
      throw apiNotFound('SCHOOL_ADMIN_ASSIGNMENT_NOT_FOUND', 'School admin assignment not found', {
        assignmentId,
      });
    }

    const row = await this.prisma.userTenantSchoolAssignment.update({
      where: { id: assignmentId },
      data: {
        deletedAt: new Date(),
        deletedById: user.sub,
        updatedById: user.sub,
      },
      include: {
        school: true,
        userTenant: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.toSchoolAdminAssignmentResponse(row);
  }

  private async getScopedSchoolIds(user: AuthenticatedUser): Promise<string[] | null> {
    const membership = await this.prisma.userTenant.findFirst({
      where: {
        tenantId: user.tenantId,
        userId: user.sub,
        deletedAt: null,
      },
      include: {
        schoolAssignments: {
          where: { deletedAt: null },
          select: { schoolId: true },
        },
      },
    });

    if (!membership) return [];

    if (membership.schoolAssignments.length === 0) {
      return null;
    }

    return Array.from(new Set(membership.schoolAssignments.map((row) => row.schoolId)));
  }

  private async ensureSchoolAccessible(user: AuthenticatedUser, schoolId: string): Promise<void> {
    const schoolIds = await this.getScopedSchoolIds(user);
    const school = await this.prisma.school.findFirst({
      where: {
        id: schoolId,
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolIds ? { id: { in: schoolIds } } : {}),
      },
      select: { id: true },
    });

    if (!school) {
      throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId });
    }
  }

  private toResponse(school: School): SchoolResponseDto {
    return {
      id: school.id,
      tenantId: school.tenantId,
      code: school.code,
      name: school.name,
      board: school.board,
      contactEmail: school.contactEmail,
      contactPhone: school.contactPhone,
      createdAt: school.createdAt.toISOString(),
      updatedAt: school.updatedAt.toISOString(),
    };
  }

  private toCampusResponse(campus: Campus): CampusResponseDto {
    return {
      id: campus.id,
      tenantId: campus.tenantId,
      schoolId: campus.schoolId,
      code: campus.code,
      name: campus.name,
      addressLine1: campus.addressLine1,
      addressLine2: campus.addressLine2,
      city: campus.city,
      state: campus.state,
      postalCode: campus.postalCode,
      createdAt: campus.createdAt.toISOString(),
      updatedAt: campus.updatedAt.toISOString(),
    };
  }

  private toSchoolAdminAssignmentResponse(
    assignment: UserTenantSchoolAssignment & {
      school: School;
      userTenant: {
        id: string;
        user: {
          id: string;
          email: string;
        };
      };
    },
  ): SchoolAdminAssignmentResponseDto {
    return {
      id: assignment.id,
      tenantId: assignment.tenantId,
      userTenantId: assignment.userTenantId,
      schoolId: assignment.schoolId,
      canManageAllCampuses: assignment.canManageAllCampuses,
      userId: assignment.userTenant.user.id,
      userEmail: assignment.userTenant.user.email,
      schoolCode: assignment.school.code,
      schoolName: assignment.school.name,
      createdAt: assignment.createdAt.toISOString(),
      updatedAt: assignment.updatedAt.toISOString(),
    };
  }
}
