import { PrismaService } from '@gps/data-access-db';
import {
  Campus,
  MembershipStatus,
  School,
  UserStatus,
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
import { SchoolReadinessResponseDto } from './dto/school-readiness-response.dto';
import { ProvisionSchoolDto } from './dto/provision-school.dto';
import { ProvisionSchoolResponseDto } from './dto/provision-school-response.dto';
import { PlatformProvisionSchoolDto } from './dto/platform-provision-school.dto';
import { PlatformSchoolResponseDto } from './dto/platform-school-response.dto';
import { PlatformTenantResponseDto } from './dto/platform-tenant-response.dto';
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

  async getReadiness(
    user: AuthenticatedUser,
    schoolId: string,
  ): Promise<SchoolReadinessResponseDto> {
    await this.ensureSchoolAccessible(user, schoolId);

    const [school, campusCount, currentAcademicYear, staffCount, teacherCount, studentCount, feePlanCount] =
      await Promise.all([
        this.prisma.school.findFirstOrThrow({
          where: { id: schoolId, tenantId: user.tenantId, deletedAt: null },
          select: { id: true, name: true, board: true, contactEmail: true, contactPhone: true },
        }),
        this.prisma.campus.count({ where: { schoolId, tenantId: user.tenantId, deletedAt: null } }),
        this.prisma.academicYear.findFirst({
          where: { schoolId, tenantId: user.tenantId, deletedAt: null, isCurrent: true },
          select: { id: true },
        }),
        this.prisma.staffProfile.count({ where: { schoolId, tenantId: user.tenantId, deletedAt: null } }),
        this.prisma.teacherProfile.count({
          where: { tenantId: user.tenantId, staffProfile: { schoolId, deletedAt: null } },
        }),
        this.prisma.student.count({ where: { schoolId, tenantId: user.tenantId, deletedAt: null } }),
        this.prisma.feePlan.count({ where: { schoolId, tenantId: user.tenantId, deletedAt: null } }),
      ]);

    const classRoomCount = currentAcademicYear
      ? await this.prisma.classRoom.count({
          where: {
            schoolId,
            tenantId: user.tenantId,
            academicYearId: currentAcademicYear.id,
            deletedAt: null,
          },
        })
      : 0;

    const steps: SchoolReadinessResponseDto['steps'] = [
      {
        id: 'school-profile',
        label: 'School profile',
        description: 'Add the school identity and primary contact details.',
        complete: Boolean(school.name && school.board && (school.contactEmail || school.contactPhone)),
        required: true,
        count: 1,
        href: '/app/settings/school',
      },
      {
        id: 'campuses',
        label: 'Campuses',
        description: 'Configure at least one operating campus.',
        complete: campusCount > 0,
        required: true,
        count: campusCount,
        href: '/app/campuses',
      },
      {
        id: 'academic-year',
        label: 'Academic year',
        description: 'Set the current academic year and terms.',
        complete: Boolean(currentAcademicYear),
        required: true,
        count: currentAcademicYear ? 1 : 0,
        href: '/app/academics',
      },
      {
        id: 'classes-sections',
        label: 'Classes and sections',
        description: 'Create the classes and sections for the current year.',
        complete: classRoomCount > 0,
        required: true,
        count: classRoomCount,
        href: '/app/classes',
      },
      {
        id: 'staff',
        label: 'Staff',
        description: 'Bring in staff and assign their operating roles.',
        complete: staffCount > 0,
        required: true,
        count: staffCount,
        href: '/app/teachers',
      },
      {
        id: 'teachers',
        label: 'Teachers',
        description: 'Create teacher profiles and assignments.',
        complete: teacherCount > 0,
        required: true,
        count: teacherCount,
        href: '/app/teachers',
      },
      {
        id: 'students',
        label: 'Students and guardians',
        description: 'Import students and connect their guardians.',
        complete: studentCount > 0,
        required: true,
        count: studentCount,
        href: '/app/students',
      },
      {
        id: 'fee-structures',
        label: 'Fee structures',
        description: 'Configure fee plans when the school collects fees through GPS.',
        complete: feePlanCount > 0,
        required: false,
        count: feePlanCount,
        href: '/app/fees',
      },
    ];

    const requiredSteps = steps.filter((step) => step.required);
    const completedRequiredSteps = requiredSteps.filter((step) => step.complete).length;
    const percent = Math.round((completedRequiredSteps / requiredSteps.length) * 100);

    return {
      schoolId: school.id,
      schoolName: school.name,
      percent,
      status: percent === 0 ? 'NOT_STARTED' : percent === 100 ? 'READY' : 'IN_PROGRESS',
      steps,
    };
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

  async provision(
    user: AuthenticatedUser,
    dto: ProvisionSchoolDto,
  ): Promise<ProvisionSchoolResponseDto> {
    return this.provisionForTenant(user, user.tenantId, dto);
  }

  async provisionPlatformSchool(
    user: AuthenticatedUser,
    dto: PlatformProvisionSchoolDto,
  ): Promise<ProvisionSchoolResponseDto> {
    return this.provisionForTenant(user, dto.tenantId, dto);
  }

  async listPlatformTenants(): Promise<PlatformTenantResponseDto[]> {
    const tenants = await this.prisma.tenant.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { schools: true } } },
      orderBy: [{ name: 'asc' }],
    });

    return tenants.map((tenant) => ({
      id: tenant.id,
      code: tenant.code,
      name: tenant.name,
      status: tenant.status,
      schoolCount: tenant._count.schools,
    }));
  }

  async listPlatformSchools(): Promise<PlatformSchoolResponseDto[]> {
    const schools = await this.prisma.school.findMany({
      where: { deletedAt: null },
      include: { tenant: true, _count: { select: { campuses: true } } },
      orderBy: [{ name: 'asc' }],
    });

    return schools.map((school) => ({
      id: school.id,
      tenantId: school.tenantId,
      tenantCode: school.tenant.code,
      tenantName: school.tenant.name,
      code: school.code,
      name: school.name,
      board: school.board,
      campusCount: school._count.campuses,
      createdAt: school.createdAt.toISOString(),
    }));
  }

  private async provisionForTenant(
    user: AuthenticatedUser,
    targetTenantId: string,
    dto: ProvisionSchoolDto,
  ): Promise<ProvisionSchoolResponseDto> {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id: targetTenantId, deletedAt: null },
      select: { id: true },
    });
    if (!tenant) {
      throw apiNotFound('TENANT_NOT_FOUND', 'Institution not found', { tenantId: targetTenantId });
    }

    const existingSchool = await this.prisma.school.findFirst({
      where: { tenantId: targetTenantId, code: dto.schoolCode, deletedAt: null },
      select: { id: true },
    });

    if (existingSchool) {
      throw apiConflict('SCHOOL_CODE_CONFLICT', 'School code already exists in this tenant', {
        code: dto.schoolCode,
      });
    }

    const provisioned = await this.prisma.$transaction(async (tx) => {
      const school = await tx.school.create({
        data: {
          tenantId: targetTenantId,
          code: dto.schoolCode,
          name: dto.schoolName,
          board: dto.board,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          createdById: user.sub,
          updatedById: user.sub,
        },
      });

      const campus = await tx.campus.create({
        data: {
          tenantId: targetTenantId,
          schoolId: school.id,
          code: dto.campusCode,
          name: dto.campusName,
          createdById: user.sub,
          updatedById: user.sub,
        },
      });

      const existingUser = await tx.user.findUnique({
        where: { email: dto.adminEmail },
      });
      const adminUser =
        existingUser ??
        (await tx.user.create({
          data: {
            email: dto.adminEmail,
            firstName: dto.adminFirstName,
            lastName: dto.adminLastName,
            status: UserStatus.INVITED,
            createdById: user.sub,
            updatedById: user.sub,
          },
        }));

      const membership = await tx.userTenant.upsert({
        where: {
          tenantId_userId: {
            tenantId: targetTenantId,
            userId: adminUser.id,
          },
        },
        create: {
          tenantId: targetTenantId,
          userId: adminUser.id,
          status: MembershipStatus.INVITED,
          createdById: user.sub,
          updatedById: user.sub,
        },
        update: {
          deletedAt: null,
          deletedById: null,
          updatedById: user.sub,
        },
      });

      const adminRole = await tx.role.findFirst({
        where: {
          tenantId: targetTenantId,
          key: { in: ['school_admin', 'tenant_admin', 'admin', 'super_admin'] },
          deletedAt: null,
        },
        orderBy: [{ key: 'asc' }],
      });

      if (!adminRole) {
        throw apiBadRequest(
          'SCHOOL_ADMIN_ROLE_NOT_CONFIGURED',
          'No school administrator role is configured for this tenant',
        );
      }

      await tx.userRoleAssignment.upsert({
        where: {
          userTenantId_roleId: {
            userTenantId: membership.id,
            roleId: adminRole.id,
          },
        },
        create: {
          userTenantId: membership.id,
          roleId: adminRole.id,
          createdById: user.sub,
          updatedById: user.sub,
        },
        update: {
          deletedAt: null,
          deletedById: null,
          updatedById: user.sub,
        },
      });

      const assignment = await tx.userTenantSchoolAssignment.create({
        data: {
          tenantId: targetTenantId,
          userTenantId: membership.id,
          schoolId: school.id,
          canManageAllCampuses: true,
          createdById: user.sub,
          updatedById: user.sub,
        },
      });

      return { school, campus, adminUser, membership, adminRole, assignment };
    });

    return {
      school: this.toResponse(provisioned.school),
      campus: this.toCampusResponse(provisioned.campus),
      schoolAdmin: {
        userId: provisioned.adminUser.id,
        userTenantId: provisioned.membership.id,
        email: provisioned.adminUser.email,
        firstName: provisioned.adminUser.firstName,
        lastName: provisioned.adminUser.lastName,
        status: provisioned.adminUser.status === UserStatus.ACTIVE ? 'ACTIVE' : 'INVITED',
        roleKey: provisioned.adminRole.key,
      },
      status: 'ADMIN_INVITED',
    };
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
