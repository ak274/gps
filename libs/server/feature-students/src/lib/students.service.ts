import {
  EnrollmentStatus,
  Gender,
  Prisma,
  Student,
  StudentDocumentStatus,
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
import { PreviewStudentsImportResponseDto } from './dto/preview-students-import-response.dto';
import { CreateFamilyDto } from './dto/create-family.dto';
import { LinkFamilyMemberDto } from './dto/link-family-member.dto';
import { CreateFamilyAlumniDto } from './dto/create-family-alumni.dto';
import { CreateFamilyBenefitDto } from './dto/create-family-benefit.dto';
import { FamilyResponseDto } from './dto/family-response.dto';
import { UpdateStudentDocumentReviewDto, UpsertStudentDocumentDto, UpsertStudentMedicalProfileDto } from './dto/student-records.dto';

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

  async listStudentDocuments(authUser: AuthenticatedUser, studentId: string) {
    await this.ensureStudent(authUser, studentId);
    return this.prisma.studentDocumentRecord.findMany({ where: { tenantId: authUser.tenantId, studentId }, include: { document: true, verifiedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: [{ isRequired: 'desc' }, { label: 'asc' }] });
  }

  async upsertStudentDocument(authUser: AuthenticatedUser, studentId: string, dto: UpsertStudentDocumentDto) {
    const student = await this.ensureStudent(authUser, studentId);
    if (dto.documentId) {
      const document = await this.prisma.document.findFirst({ where: { id: dto.documentId, tenantId: authUser.tenantId, entityType: 'STUDENT', entityId: studentId, deletedAt: null }, select: { id: true } });
      if (!document) throw apiNotFound('STUDENT_DOCUMENT_NOT_FOUND', 'Uploaded student document metadata was not found');
    }
    const status = dto.status ?? (dto.documentId ? StudentDocumentStatus.PENDING : dto.isRequired ? StudentDocumentStatus.REQUIRED : StudentDocumentStatus.PENDING);
    return this.prisma.studentDocumentRecord.upsert({ where: { studentId_key: { studentId, key: dto.key } }, create: { tenantId: authUser.tenantId, schoolId: student.schoolId, studentId, documentId: dto.documentId, key: dto.key, label: dto.label, isRequired: dto.isRequired ?? false, status, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, reviewNote: dto.reviewNote }, update: { documentId: dto.documentId, label: dto.label, isRequired: dto.isRequired ?? false, status, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, reviewNote: dto.reviewNote, ...(status === StudentDocumentStatus.VERIFIED ? { verifiedAt: new Date(), verifiedById: authUser.sub } : {}) } });
  }

  async reviewStudentDocument(authUser: AuthenticatedUser, studentId: string, documentId: string, dto: UpdateStudentDocumentReviewDto) {
    await this.ensureStudent(authUser, studentId);
    const existing = await this.prisma.studentDocumentRecord.findFirst({ where: { id: documentId, tenantId: authUser.tenantId, studentId } });
    if (!existing) throw apiNotFound('STUDENT_DOCUMENT_RECORD_NOT_FOUND', 'Student document requirement was not found');
    return this.prisma.studentDocumentRecord.update({ where: { id: existing.id }, data: { status: dto.status, reviewNote: dto.reviewNote, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null, ...(dto.status === StudentDocumentStatus.VERIFIED ? { verifiedAt: new Date(), verifiedById: authUser.sub } : { verifiedAt: null, verifiedById: null }) } });
  }

  async getStudentMedicalProfile(authUser: AuthenticatedUser, studentId: string) {
    await this.ensureStudent(authUser, studentId);
    return this.prisma.studentMedicalProfile.findUnique({ where: { studentId } });
  }

  async upsertStudentMedicalProfile(authUser: AuthenticatedUser, studentId: string, dto: UpsertStudentMedicalProfileDto) {
    const student = await this.ensureStudent(authUser, studentId);
    return this.prisma.studentMedicalProfile.upsert({ where: { studentId }, create: { tenantId: authUser.tenantId, schoolId: student.schoolId, studentId, ...dto }, update: { ...dto } });
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
    await this.ensureImportScope(authUser, dto.records);
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

    const records = this.toImportRecords(rows, dto);

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

  async previewBulkImportCsv(
    authUser: AuthenticatedUser,
    dto: BulkImportStudentsCsvDto,
    file?: Express.Multer.File,
  ): Promise<PreviewStudentsImportResponseDto> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw apiUnprocessable('STUDENTS_IMPORT_FILE_MISSING', 'CSV file is required');
    }

    const text = file.buffer.toString('utf8');
    const rows = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, string>>;
    const records = this.toImportRecords(rows, dto);
    await this.ensureImportScope(authUser, records);

    const existingAdmissions = new Set(
      (
        await this.prisma.student.findMany({
          where: {
            tenantId: authUser.tenantId,
            schoolId: dto.schoolId,
            deletedAt: null,
            admissionNo: { in: records.map((record) => record.admissionNo).filter(Boolean) },
          },
          select: { admissionNo: true },
        })
      ).map((student) => student.admissionNo),
    );
    const errors: BulkImportStudentErrorDto[] = [];
    const admissionNumbers = new Map<string, number>();
    const validRecords: CreateStudentDto[] = [];

    records.forEach((record, rowIndex) => {
      const admissionNo = record.admissionNo?.trim();
      const rowErrors: BulkImportStudentErrorDto[] = [];
      if (!admissionNo || !record.firstName?.trim()) {
        rowErrors.push({
          rowIndex,
          code: 'REQUIRED_FIELD_MISSING',
          message: 'Admission number and first name are required',
          details: { admissionNo: record.admissionNo ?? null },
        });
      }
      if (admissionNo && admissionNumbers.has(admissionNo)) {
        rowErrors.push({
          rowIndex,
          code: 'DUPLICATE_IN_FILE',
          message: 'Admission number is repeated in this file',
          details: { firstRowIndex: admissionNumbers.get(admissionNo), admissionNo },
        });
      }
      if (admissionNo) admissionNumbers.set(admissionNo, rowIndex);
      if (admissionNo && existingAdmissions.has(admissionNo)) {
        rowErrors.push({
          rowIndex,
          code: 'ADMISSION_NO_EXISTS',
          message: 'Admission number already exists in this school',
          details: { admissionNo },
        });
      }
      if (record.gender && !Object.values(Gender).includes(record.gender)) {
        rowErrors.push({
          rowIndex,
          code: 'INVALID_GENDER',
          message: 'Gender must be one of the supported GPS values',
          details: { gender: record.gender },
        });
      }

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

  async listFamilies(authUser: AuthenticatedUser): Promise<FamilyResponseDto[]> {
    const rows = await this.prisma.family.findMany({
      where: { tenantId: authUser.tenantId, deletedAt: null },
      include: {
        students: { include: { student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, schoolId: true } } } },
        guardians: { include: { guardian: { select: { id: true, firstName: true, lastName: true, phoneE164: true, email: true } } } },
        alumni: { select: { id: true, schoolId: true, name: true, relationshipLabel: true, graduationYear: true, admissionNo: true } },
        benefits: { where: { isActive: true }, select: { id: true, schoolId: true, feePlanId: true, type: true, value: true, minimumStudentCount: true, reason: true } },
      },
      orderBy: [{ displayName: 'asc' }],
    });
    return rows.map((row) => this.toFamilyResponse(row));
  }

  async createFamily(authUser: AuthenticatedUser, dto: CreateFamilyDto): Promise<FamilyResponseDto> {
    const row = await this.prisma.family.create({ data: { tenantId: authUser.tenantId, displayName: dto.displayName, notes: dto.notes, createdById: authUser.sub, updatedById: authUser.sub } });
    return this.getFamily(authUser, row.id);
  }

  async getFamily(authUser: AuthenticatedUser, familyId: string): Promise<FamilyResponseDto> {
    const row = await this.prisma.family.findFirst({
      where: { id: familyId, tenantId: authUser.tenantId, deletedAt: null },
      include: {
        students: { include: { student: { select: { id: true, firstName: true, lastName: true, admissionNo: true, schoolId: true } } } },
        guardians: { include: { guardian: { select: { id: true, firstName: true, lastName: true, phoneE164: true, email: true } } } },
        alumni: { select: { id: true, schoolId: true, name: true, relationshipLabel: true, graduationYear: true, admissionNo: true } },
        benefits: { where: { isActive: true }, select: { id: true, schoolId: true, feePlanId: true, type: true, value: true, minimumStudentCount: true, reason: true } },
      },
    });
    if (!row) throw apiNotFound('FAMILY_NOT_FOUND', 'Family not found', { familyId });
    return this.toFamilyResponse(row);
  }

  async linkFamilyStudent(authUser: AuthenticatedUser, familyId: string, dto: LinkFamilyMemberDto) {
    await this.ensureFamily(authUser, familyId);
    const student = await this.prisma.student.findFirst({ where: { id: dto.memberId, tenantId: authUser.tenantId, deletedAt: null }, select: { id: true } });
    if (!student) throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId: dto.memberId });
    await this.prisma.familyStudent.upsert({ where: { familyId_studentId: { familyId, studentId: dto.memberId } }, create: { familyId, studentId: dto.memberId, relationshipLabel: dto.relationshipLabel }, update: { relationshipLabel: dto.relationshipLabel } });
    return this.getFamily(authUser, familyId);
  }

  async linkFamilyGuardian(authUser: AuthenticatedUser, familyId: string, dto: LinkFamilyMemberDto) {
    await this.ensureFamily(authUser, familyId);
    const guardian = await this.prisma.guardian.findFirst({ where: { id: dto.memberId, tenantId: authUser.tenantId, deletedAt: null }, select: { id: true } });
    if (!guardian) throw apiNotFound('GUARDIAN_NOT_FOUND', 'Guardian not found', { guardianId: dto.memberId });
    await this.prisma.familyGuardian.upsert({ where: { familyId_guardianId: { familyId, guardianId: dto.memberId } }, create: { familyId, guardianId: dto.memberId, relationshipLabel: dto.relationshipLabel }, update: { relationshipLabel: dto.relationshipLabel } });
    return this.getFamily(authUser, familyId);
  }

  async addFamilyAlumni(authUser: AuthenticatedUser, familyId: string, dto: CreateFamilyAlumniDto) {
    await this.ensureFamily(authUser, familyId);
    const school = await this.prisma.school.findFirst({ where: { id: dto.schoolId, tenantId: authUser.tenantId }, select: { id: true } });
    if (!school) throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId: dto.schoolId });
    await this.prisma.familyAlumni.create({ data: { familyId, schoolId: dto.schoolId, name: dto.name, relationshipLabel: dto.relationshipLabel, admissionNo: dto.admissionNo, graduationYear: dto.graduationYear, notes: dto.notes } });
    return this.getFamily(authUser, familyId);
  }

  async addFamilyBenefit(authUser: AuthenticatedUser, familyId: string, dto: CreateFamilyBenefitDto) {
    await this.ensureFamily(authUser, familyId);
    const school = await this.prisma.school.findFirst({ where: { id: dto.schoolId, tenantId: authUser.tenantId }, select: { id: true } });
    if (!school) throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found', { schoolId: dto.schoolId });
    await this.prisma.familyBenefit.create({ data: { familyId, schoolId: dto.schoolId, feePlanId: dto.feePlanId, type: dto.type, value: dto.value, minimumStudentCount: dto.minimumStudentCount ?? 2, reason: dto.reason } });
    return this.getFamily(authUser, familyId);
  }

  private async ensureFamily(authUser: AuthenticatedUser, familyId: string) {
    const family = await this.prisma.family.findFirst({ where: { id: familyId, tenantId: authUser.tenantId, deletedAt: null }, select: { id: true } });
    if (!family) throw apiNotFound('FAMILY_NOT_FOUND', 'Family not found', { familyId });
  }

  private toFamilyResponse(row: any): FamilyResponseDto {
    return {
      id: row.id,
      displayName: row.displayName,
      notes: row.notes,
      students: row.students.map((item: any) => ({ ...item.student, relationshipLabel: item.relationshipLabel })),
      guardians: row.guardians.map((item: any) => ({ ...item.guardian, relationshipLabel: item.relationshipLabel })),
      alumni: row.alumni,
      benefits: row.benefits.map((benefit: any) => ({ ...benefit, value: benefit.value.toString() })),
    };
  }

  private toImportRecords(
    rows: Array<Record<string, string>>,
    dto: BulkImportStudentsCsvDto,
  ): CreateStudentDto[] {
    return rows.map((row) => ({
      schoolId: dto.schoolId,
      campusId: dto.campusId,
      admissionNo: row.admissionNo?.trim(),
      firstName: row.firstName?.trim(),
      lastName: row.lastName || undefined,
      gender: row.gender?.trim() as Gender | undefined,
      dateOfBirth: row.dateOfBirth || undefined,
      joinedOn: row.joinedOn || undefined,
      profilePhotoKey: row.profilePhotoKey || undefined,
    }));
  }

  private async ensureImportScope(
    authUser: AuthenticatedUser,
    records: CreateStudentDto[],
  ): Promise<void> {
    const schoolIds = Array.from(new Set(records.map((record) => record.schoolId)));
    const schools = await this.prisma.school.findMany({
      where: { tenantId: authUser.tenantId, id: { in: schoolIds }, deletedAt: null },
      select: { id: true },
    });
    if (schools.length !== schoolIds.length) {
      throw apiUnprocessable(
        'STUDENTS_IMPORT_SCHOOL_SCOPE_INVALID',
        'One or more import records target a school outside your access scope',
      );
    }

    const campusPairs = records
      .filter((record) => record.campusId)
      .map((record) => ({ schoolId: record.schoolId, campusId: record.campusId as string }));
    if (campusPairs.length === 0) return;

    const campuses = await this.prisma.campus.findMany({
      where: {
        tenantId: authUser.tenantId,
        deletedAt: null,
        OR: campusPairs.map((pair) => ({ id: pair.campusId, schoolId: pair.schoolId })),
      },
      select: { id: true, schoolId: true },
    });
    const campusKeys = new Set(campuses.map((campus) => `${campus.schoolId}:${campus.id}`));
    const invalidCampus = campusPairs.find(
      (pair) => !campusKeys.has(`${pair.schoolId}:${pair.campusId}`),
    );
    if (invalidCampus) {
      throw apiUnprocessable(
        'STUDENTS_IMPORT_CAMPUS_SCOPE_INVALID',
        'One or more import records target a campus that does not belong to its school',
        invalidCampus,
      );
    }
  }

  private async ensureStudent(authUser: AuthenticatedUser, studentId: string) {
    const student = await this.prisma.student.findFirst({ where: { id: studentId, tenantId: authUser.tenantId, deletedAt: null }, select: { id: true, schoolId: true } });
    if (!student) throw apiNotFound('STUDENT_NOT_FOUND', 'Student not found', { studentId });
    return student;
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
