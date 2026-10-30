import { PrismaService } from '@gps/data-access-db';
import {
  AdmissionApplication,
  AdmissionFormStatus,
  AdmissionFieldType,
  AdmissionDocumentStage,
  AdmissionLeadStatus,
  AdmissionEventType,
  AdmissionDocumentReviewStatus,
  Prisma,
  AdmissionStatus,
  EnrollmentStatus,
  Gender,
} from '@gps/data-access-prisma';
import { apiConflict, apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { EnrollAdmissionApplicationDto } from './dto/enroll-admission-application.dto';
import { AdmissionApplicationResponseDto } from './dto/admission-application-response.dto';
import { ListAdmissionApplicationsQueryDto } from './dto/list-admission-applications-query.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';
import { CreateAdmissionFormDto } from './dto/create-admission-form.dto';
import { CreateAdmissionFormSectionDto } from './dto/create-admission-form-section.dto';
import { CreateAdmissionFormFieldDto } from './dto/create-admission-form-field.dto';
import { CreateAdmissionDocumentRequirementDto } from './dto/create-admission-document-requirement.dto';
import { AdmissionFormResponseDto } from './dto/admission-form-response.dto';
import { ListAdmissionFormsQueryDto } from './dto/list-admission-forms-query.dto';
import { RecordAdmissionDocumentDto, ReviewAdmissionDocumentDto, TransitionAdmissionApplicationDto } from './dto/admission-workflow.dto';
import {
  SavePublicAdmissionDraftDto,
  StartPublicAdmissionDto,
  VerifyPublicAdmissionDto,
} from './dto/public-admission.dto';

@Injectable()
export class AdmissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicForm(schoolId: string, formId?: string) {
    const school = await this.prisma.school.findFirst({ where: { id: schoolId, deletedAt: null }, select: { id: true, name: true, board: true } });
    if (!school) throw apiNotFound('ADMISSION_SCHOOL_NOT_FOUND', 'School admission page not found');
    const form = await this.prisma.admissionForm.findFirst({
      where: { schoolId, status: AdmissionFormStatus.PUBLISHED, ...(formId ? { id: formId } : {}) },
      include: { sections: { orderBy: [{ sortOrder: 'asc' }], include: { fields: { orderBy: [{ sortOrder: 'asc' }] } } }, documents: { orderBy: [{ createdAt: 'asc' }] } },
      orderBy: [{ version: 'desc' }],
    });
    if (!form) throw apiNotFound('ADMISSION_FORM_NOT_FOUND', 'This school is not accepting applications right now');
    const [academicYear, campuses, classes] = await Promise.all([
      this.prisma.academicYear.findUnique({ where: { id: form.academicYearId }, select: { id: true, name: true } }),
      this.prisma.campus.findMany({ where: { schoolId, deletedAt: null }, select: { id: true, name: true, code: true }, orderBy: [{ name: 'asc' }] }),
      this.prisma.classRoom.findMany({ where: { schoolId, academicYearId: form.academicYearId, deletedAt: null }, select: { id: true, name: true, gradeLevel: true, section: true, campusId: true }, orderBy: [{ gradeLevel: 'asc' }, { section: 'asc' }] }),
    ]);
    return { school, academicYear, campuses, classes, form: this.toFormResponse(form) };
  }

  async startPublicLead(dto: StartPublicAdmissionDto) {
    const selected = await this.getPublicForm(dto.schoolId, dto.formId);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const resumeToken = randomBytes(32).toString('hex');
    const now = new Date();
    const lead = await this.prisma.admissionLead.create({
      data: {
        tenantId: (await this.prisma.school.findUniqueOrThrow({ where: { id: dto.schoolId }, select: { tenantId: true } })).tenantId,
        schoolId: dto.schoolId,
        formId: selected.form.id,
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone.trim(),
        firstName: dto.firstName.trim(),
        lastName: dto.lastName?.trim() || undefined,
        verificationCodeHash: this.hashPublicAdmissionSecret(code),
        verificationExpiresAt: new Date(now.getTime() + 15 * 60 * 1000),
        resumeTokenHash: this.hashPublicAdmissionSecret(resumeToken),
        draftData: { parentFirstName: dto.firstName.trim(), parentLastName: dto.lastName?.trim() || '', parentEmail: dto.email.trim().toLowerCase(), parentPhone: dto.phone.trim(), campusId: dto.campusId ?? '', classRoomId: dto.classRoomId ?? '' },
      },
    });
    return { leadId: lead.id, email: lead.email, expiresAt: lead.verificationExpiresAt, school: selected.school, form: selected.form, verificationPreviewCode: process.env.NODE_ENV === 'production' ? undefined : code };
  }

  async verifyPublicLead(leadId: string, dto: VerifyPublicAdmissionDto) {
    const lead = await this.prisma.admissionLead.findUnique({ where: { id: leadId }, include: { form: { include: { sections: { orderBy: [{ sortOrder: 'asc' }], include: { fields: { orderBy: [{ sortOrder: 'asc' }] } } }, documents: { orderBy: [{ createdAt: 'asc' }] } } }, school: { select: { id: true, name: true, board: true } } } });
    if (!lead || lead.status === 'EXPIRED') throw apiNotFound('ADMISSION_LEAD_NOT_FOUND', 'Your application session could not be found');
    if (lead.verificationExpiresAt < new Date()) throw apiUnprocessable('ADMISSION_CODE_EXPIRED', 'This verification code has expired. Please start again.');
    if (this.hashPublicAdmissionSecret(dto.code) !== lead.verificationCodeHash) throw apiUnprocessable('ADMISSION_CODE_INVALID', 'That verification code is not correct.');
    const resumeToken = randomBytes(32).toString('hex');
    await this.prisma.admissionLead.update({ where: { id: lead.id }, data: { status: 'VERIFIED', verifiedAt: new Date(), resumeTokenHash: this.hashPublicAdmissionSecret(resumeToken) } });
    return { leadId: lead.id, resumeToken, school: lead.school, form: this.toFormResponse(lead.form), draftData: lead.draftData, currentSection: lead.currentSection };
  }

  async getPublicLead(leadId: string, resumeToken: string) {
    const lead = await this.findPublicLead(leadId, resumeToken);
    return { leadId: lead.id, status: lead.status, email: lead.email, school: { id: lead.school.id, name: lead.school.name, board: lead.school.board }, form: this.toFormResponse(lead.form), draftData: lead.draftData, currentSection: lead.currentSection, lastSavedAt: lead.lastSavedAt };
  }

  async savePublicLead(leadId: string, resumeToken: string, dto: SavePublicAdmissionDraftDto) {
    const lead = await this.findPublicLead(leadId, resumeToken);
    const updated = await this.prisma.admissionLead.update({ where: { id: lead.id }, data: { draftData: dto.draftData as Prisma.InputJsonValue, currentSection: dto.currentSection ?? lead.currentSection, lastSavedAt: new Date() } });
    return { savedAt: updated.lastSavedAt, currentSection: updated.currentSection };
  }

  async submitPublicLead(leadId: string, resumeToken: string) {
    const lead = await this.findPublicLead(leadId, resumeToken);
    const draft = (lead.draftData ?? {}) as Record<string, unknown>;
    const studentFirstName = String(draft.studentFirstName ?? draft.firstName ?? '').trim();
    const dateOfBirth = String(draft.dateOfBirth ?? '').trim();
    if (!studentFirstName || !dateOfBirth) throw apiUnprocessable('ADMISSION_REQUIRED_DETAILS_MISSING', 'Add the student name and date of birth before submitting.');
    this.validateFormData(draft, lead.form.sections);
    const now = new Date();
    const application = await this.prisma.admissionApplication.create({ data: { tenantId: lead.tenantId, schoolId: lead.schoolId, campusId: typeof draft.campusId === 'string' && draft.campusId ? draft.campusId : undefined, academicYearId: lead.form.academicYearId, classRoomId: typeof draft.classRoomId === 'string' && draft.classRoomId ? draft.classRoomId : undefined, formId: lead.formId, formVersion: lead.form.version, applicationNumber: `ADM-${now.getUTCFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, status: AdmissionStatus.SUBMITTED, applicationSource: 'PUBLIC_WEB', formData: draft as Prisma.InputJsonValue, termsVersion: `v${lead.form.version}`, parentAcknowledgedAt: now, firstName: studentFirstName, lastName: String(draft.studentLastName ?? draft.lastName ?? '').trim() || undefined, gender: Gender.UNDISCLOSED, dateOfBirth: new Date(dateOfBirth), guardianFirstName: lead.firstName, guardianLastName: lead.lastName, guardianPhoneE164: lead.phone, guardianEmail: lead.email, relationType: String(draft.primaryGuardianRelation ?? 'Parent'), submittedAt: now } });
    await this.prisma.admissionApplicationEvent.create({ data: { tenantId: lead.tenantId, schoolId: lead.schoolId, applicationId: application.id, type: AdmissionEventType.SUBMITTED, toStatus: AdmissionStatus.SUBMITTED, message: 'Application submitted by parent', metadata: { leadId: lead.id } } });
    await this.prisma.admissionLead.update({ where: { id: lead.id }, data: { status: AdmissionLeadStatus.SUBMITTED, submittedAt: now } });
    return { applicationId: application.id, applicationNumber: application.applicationNumber, submittedAt: now };
  }

  private hashPublicAdmissionSecret(value: string) { return createHash('sha256').update(value).digest('hex'); }

  private async findPublicLead(leadId: string, resumeToken: string) {
    const lead = await this.prisma.admissionLead.findUnique({ where: { id: leadId }, include: { school: { select: { id: true, name: true, board: true } }, form: { include: { sections: { orderBy: [{ sortOrder: 'asc' }], include: { fields: { orderBy: [{ sortOrder: 'asc' }] } } }, documents: { orderBy: [{ createdAt: 'asc' }] } } } } });
    if (!lead || lead.status !== 'VERIFIED' || this.hashPublicAdmissionSecret(resumeToken) !== lead.resumeTokenHash) throw apiNotFound('ADMISSION_SESSION_NOT_FOUND', 'Your saved admission session could not be found');
    return lead;
  }

  async listForms(user: AuthenticatedUser, query: ListAdmissionFormsQueryDto): Promise<AdmissionFormResponseDto[]> {
    const forms = await this.prisma.admissionForm.findMany({
      where: { tenantId: user.tenantId, ...(query.schoolId ? { schoolId: query.schoolId } : {}), ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}), ...(query.status ? { status: query.status } : {}) },
      include: { sections: { orderBy: [{ sortOrder: 'asc' }], include: { fields: { orderBy: [{ sortOrder: 'asc' }] } } }, documents: { orderBy: [{ createdAt: 'asc' }] } },
      orderBy: [{ updatedAt: 'desc' }],
    });
    return forms.map((form) => this.toFormResponse(form));
  }

  async createForm(user: AuthenticatedUser, dto: CreateAdmissionFormDto): Promise<AdmissionFormResponseDto> {
    await this.ensureSchoolYear(user, dto.schoolId, dto.academicYearId);
    const latest = await this.prisma.admissionForm.findFirst({ where: { tenantId: user.tenantId, schoolId: dto.schoolId, academicYearId: dto.academicYearId }, orderBy: [{ version: 'desc' }], select: { version: true } });
    const form = await this.prisma.admissionForm.create({ data: { tenantId: user.tenantId, schoolId: dto.schoolId, academicYearId: dto.academicYearId, name: dto.name, version: (latest?.version ?? 0) + 1, description: dto.description, termsText: dto.termsText, createdById: user.sub, updatedById: user.sub }, include: { sections: { include: { fields: true } }, documents: true } });
    return this.toFormResponse(form);
  }

  async addFormSection(user: AuthenticatedUser, formId: string, dto: CreateAdmissionFormSectionDto) {
    const form = await this.ensureDraftForm(user, formId);
    return this.prisma.admissionFormSection.create({ data: { tenantId: user.tenantId, formId: form.id, title: dto.title, description: dto.description, sortOrder: dto.sortOrder ?? 0, createdById: user.sub, updatedById: user.sub }, include: { fields: true } });
  }

  async addFormField(user: AuthenticatedUser, sectionId: string, dto: CreateAdmissionFormFieldDto) {
    const section = await this.prisma.admissionFormSection.findFirst({ where: { id: sectionId, tenantId: user.tenantId, form: { status: AdmissionFormStatus.DRAFT } }, select: { id: true, formId: true } });
    if (!section) throw apiNotFound('ADMISSION_FORM_SECTION_NOT_FOUND', 'Draft admission form section not found');
    return this.prisma.admissionFormField.create({ data: { tenantId: user.tenantId, sectionId, key: dto.key, label: dto.label, type: dto.type, helpText: dto.helpText, isRequired: dto.isRequired ?? false, isSensitive: dto.isSensitive ?? false, sortOrder: dto.sortOrder ?? 0, options: dto.options as Prisma.InputJsonValue | undefined, visibility: dto.visibility as Prisma.InputJsonValue | undefined, validation: dto.validation as Prisma.InputJsonValue | undefined, createdById: user.sub, updatedById: user.sub } });
  }

  async addDocumentRequirement(user: AuthenticatedUser, formId: string, dto: CreateAdmissionDocumentRequirementDto) {
    const form = await this.ensureDraftForm(user, formId);
    if (form.schoolId !== dto.schoolId) throw apiUnprocessable('ADMISSION_FORM_SCHOOL_MISMATCH', 'Document requirement school must match form school');
    return this.prisma.admissionDocumentRequirement.create({ data: { tenantId: user.tenantId, schoolId: dto.schoolId, formId, key: dto.key, label: dto.label, stage: dto.stage, isRequired: dto.isRequired ?? false, isSensitive: dto.isSensitive ?? false, acceptedTypes: dto.acceptedTypes as Prisma.InputJsonValue | undefined, maxSizeMb: dto.maxSizeMb, createdById: user.sub, updatedById: user.sub } });
  }

  async seedStandardForm(user: AuthenticatedUser, formId: string): Promise<AdmissionFormResponseDto> {
    const form = await this.ensureDraftForm(user, formId);
    const sections: Array<{ title: string; fields: Array<{ key: string; label: string; type: AdmissionFieldType; required?: boolean; sensitive?: boolean }> }> = [
      { title: 'Student profile', fields: [{ key: 'middleName', label: 'Middle name', type: AdmissionFieldType.TEXT }, { key: 'nationality', label: 'Nationality', type: AdmissionFieldType.TEXT, required: true }, { key: 'motherTongue', label: 'Mother tongue', type: AdmissionFieldType.TEXT }, { key: 'placeOfBirth', label: 'Place of birth', type: AdmissionFieldType.TEXT }, { key: 'studentEmail', label: 'Student email', type: AdmissionFieldType.EMAIL, sensitive: true }] },
      { title: 'Family and guardians', fields: [{ key: 'fatherOccupation', label: "Father's occupation", type: AdmissionFieldType.TEXT }, { key: 'motherOccupation', label: "Mother's occupation", type: AdmissionFieldType.TEXT }, { key: 'primaryGuardianRelation', label: 'Primary guardian relationship', type: AdmissionFieldType.TEXT, required: true }, { key: 'siblingAdmissionNo', label: 'Sibling admission number', type: AdmissionFieldType.TEXT }, { key: 'parentAlumnus', label: 'Parent is an alumnus', type: AdmissionFieldType.BOOLEAN }] },
      { title: 'Address and contact', fields: [{ key: 'currentAddress', label: 'Current address', type: AdmissionFieldType.TEXTAREA, required: true }, { key: 'district', label: 'District', type: AdmissionFieldType.TEXT, required: true }, { key: 'state', label: 'State / Union Territory', type: AdmissionFieldType.TEXT, required: true }, { key: 'pinCode', label: 'PIN code', type: AdmissionFieldType.TEXT, required: true }, { key: 'emergencyContact', label: 'Emergency contact number', type: AdmissionFieldType.PHONE, required: true }] },
      { title: 'Previous school', fields: [{ key: 'attendedPreviousSchool', label: 'Has the child attended another school?', type: AdmissionFieldType.BOOLEAN, required: true }, { key: 'previousSchoolName', label: 'Previous school name', type: AdmissionFieldType.TEXT }, { key: 'previousBoard', label: 'Previous school board', type: AdmissionFieldType.TEXT }, { key: 'lastClassCompleted', label: 'Last class successfully completed', type: AdmissionFieldType.TEXT }, { key: 'previousPercentage', label: 'Marks / percentage / grade', type: AdmissionFieldType.TEXT }] },
      { title: 'Health and support', fields: [{ key: 'knownAllergies', label: 'Known allergies', type: AdmissionFieldType.TEXTAREA, sensitive: true }, { key: 'medicalConditions', label: 'Relevant medical conditions', type: AdmissionFieldType.TEXTAREA, sensitive: true }, { key: 'physicalActivityRestrictions', label: 'Physical activity restrictions', type: AdmissionFieldType.TEXTAREA, sensitive: true }, { key: 'emergencyMedicalInstructions', label: 'Emergency medical instructions', type: AdmissionFieldType.TEXTAREA, sensitive: true }] },
      { title: 'Transport', fields: [{ key: 'requiresTransport', label: 'Does the student require school transport?', type: AdmissionFieldType.BOOLEAN }, { key: 'pickupAddress', label: 'Pickup address', type: AdmissionFieldType.TEXTAREA }, { key: 'preferredStop', label: 'Preferred route / stop', type: AdmissionFieldType.TEXT }, { key: 'transportInstructions', label: 'Special transport instructions', type: AdmissionFieldType.TEXTAREA }] },
      { title: 'Declaration and consent', fields: [{ key: 'acceptsAdmissionTerms', label: 'I accept the admission terms', type: AdmissionFieldType.BOOLEAN, required: true }, { key: 'informationAccurate', label: 'I confirm the information is accurate', type: AdmissionFieldType.BOOLEAN, required: true }, { key: 'communicationsConsent', label: 'Consent to school communications', type: AdmissionFieldType.BOOLEAN }] },
    ];
    const documents = [{ key: 'birthCertificate', label: 'Birth certificate', stage: AdmissionDocumentStage.APPLICATION, required: true }, { key: 'studentPhoto', label: 'Student photograph', stage: AdmissionDocumentStage.APPLICATION, required: true }, { key: 'addressProof', label: 'Address proof', stage: AdmissionDocumentStage.REVIEW, required: true }, { key: 'previousReportCard', label: 'Previous report card / marksheet', stage: AdmissionDocumentStage.REVIEW }, { key: 'transferCertificate', label: 'Transfer / school-leaving certificate', stage: AdmissionDocumentStage.ENROLLMENT }];
    await this.prisma.$transaction(async (tx) => {
      for (const [sectionIndex, section] of sections.entries()) {
        const createdSection = await tx.admissionFormSection.create({ data: { tenantId: user.tenantId, formId, title: section.title, sortOrder: sectionIndex, createdById: user.sub, updatedById: user.sub } });
        await tx.admissionFormField.createMany({ data: section.fields.map((field, index) => ({ tenantId: user.tenantId, sectionId: createdSection.id, key: field.key, label: field.label, type: field.type, isRequired: field.required ?? false, isSensitive: field.sensitive ?? false, sortOrder: index, createdById: user.sub, updatedById: user.sub })) });
      }
      await tx.admissionDocumentRequirement.createMany({ data: documents.map((document) => ({ tenantId: user.tenantId, schoolId: form.schoolId, formId, key: document.key, label: document.label, stage: document.stage, isRequired: document.required ?? false, acceptedTypes: ['application/pdf', 'image/jpeg', 'image/png'], createdById: user.sub, updatedById: user.sub })) });
    });
    const seeded = await this.prisma.admissionForm.findUniqueOrThrow({ where: { id: formId }, include: { sections: { orderBy: [{ sortOrder: 'asc' }], include: { fields: { orderBy: [{ sortOrder: 'asc' }] } } }, documents: { orderBy: [{ createdAt: 'asc' }] } } });
    return this.toFormResponse(seeded);
  }

  async publishForm(user: AuthenticatedUser, formId: string): Promise<AdmissionFormResponseDto> {
    const form = await this.ensureDraftForm(user, formId);
    const published = await this.prisma.$transaction(async (tx) => {
      await tx.admissionForm.updateMany({ where: { tenantId: user.tenantId, schoolId: form.schoolId, academicYearId: form.academicYearId, status: AdmissionFormStatus.PUBLISHED }, data: { status: AdmissionFormStatus.ARCHIVED, updatedAt: new Date() } });
      return tx.admissionForm.update({ where: { id: formId }, data: { status: AdmissionFormStatus.PUBLISHED, publishedAt: new Date(), updatedById: user.sub }, include: { sections: { orderBy: [{ sortOrder: 'asc' }], include: { fields: { orderBy: [{ sortOrder: 'asc' }] } } }, documents: { orderBy: [{ createdAt: 'asc' }] } } });
    });
    return this.toFormResponse(published);
  }

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

  async transitionApplication(user: AuthenticatedUser, applicationId: string, dto: TransitionAdmissionApplicationDto) {
    const existing = await this.prisma.admissionApplication.findFirst({ where: { id: applicationId, tenantId: user.tenantId, deletedAt: null } });
    if (!existing) throw apiNotFound('ADMISSION_APPLICATION_NOT_FOUND', 'Admission application not found');
    this.assertStatusTransitionAllowed(existing.status, dto.status);
    const now = new Date();
    const eventType: AdmissionEventType = dto.status === AdmissionStatus.REVIEWING ? AdmissionEventType.REVIEW_STARTED : dto.status === AdmissionStatus.INFO_REQUESTED ? AdmissionEventType.INFO_REQUESTED : dto.status === AdmissionStatus.APPROVED ? AdmissionEventType.APPROVED : dto.status === AdmissionStatus.WAITLISTED ? AdmissionEventType.WAITLISTED : dto.status === AdmissionStatus.REJECTED ? AdmissionEventType.REJECTED : dto.status === AdmissionStatus.OFFERED ? AdmissionEventType.OFFERED : dto.status === AdmissionStatus.FEE_PENDING ? AdmissionEventType.FEE_MARKED_PAID : dto.status === AdmissionStatus.READY_FOR_ENROLLMENT ? AdmissionEventType.FINAL_VERIFIED : dto.status === AdmissionStatus.ENROLLED ? AdmissionEventType.ENROLLED : AdmissionEventType.UPDATED;
    const updated = await this.prisma.$transaction(async (tx) => {
      const row = await tx.admissionApplication.update({
        where: { id: existing.id },
        data: {
          status: dto.status,
          ...(dto.status !== AdmissionStatus.DRAFT && !existing.submittedAt ? { submittedAt: now } : {}),
          ...(dto.status === AdmissionStatus.REVIEWING && !existing.reviewedAt ? { reviewedAt: now } : {}),
          ...(dto.status === AdmissionStatus.APPROVED || dto.status === AdmissionStatus.WAITLISTED || dto.status === AdmissionStatus.REJECTED ? { decidedAt: now } : {}),
          ...(dto.status === AdmissionStatus.INFO_REQUESTED ? { infoRequestedAt: now, infoRequestMessage: dto.message } : {}),
          ...(dto.status === AdmissionStatus.OFFERED ? { offerIssuedAt: now, offerExpiresAt: dto.offerExpiresAt ? new Date(dto.offerExpiresAt) : null } : {}),
          ...(dto.status === AdmissionStatus.READY_FOR_ENROLLMENT ? { finalVerifiedAt: now } : {}),
          ...(dto.status === AdmissionStatus.ENROLLED ? { enrollmentConfirmedAt: now } : {}),
          updatedById: user.sub,
        },
      });
      await tx.admissionApplicationEvent.create({ data: { tenantId: user.tenantId, schoolId: existing.schoolId, applicationId: existing.id, type: eventType, fromStatus: existing.status, toStatus: dto.status, message: dto.message, metadata: dto.metadata as Prisma.InputJsonValue | undefined, actorUserId: user.sub } });
      return row;
    });
    return this.toResponse(updated);
  }

  async getApplicationTimeline(user: AuthenticatedUser, applicationId: string) {
    const application = await this.prisma.admissionApplication.findFirst({ where: { id: applicationId, tenantId: user.tenantId, deletedAt: null }, select: { id: true } });
    if (!application) throw apiNotFound('ADMISSION_APPLICATION_NOT_FOUND', 'Admission application not found');
    return this.prisma.admissionApplicationEvent.findMany({ where: { tenantId: user.tenantId, applicationId }, orderBy: [{ createdAt: 'asc' }] });
  }

  async recordApplicationDocument(user: AuthenticatedUser, applicationId: string, dto: RecordAdmissionDocumentDto) {
    const application = await this.prisma.admissionApplication.findFirst({ where: { id: applicationId, tenantId: user.tenantId, deletedAt: null }, select: { id: true, schoolId: true } });
    if (!application) throw apiNotFound('ADMISSION_APPLICATION_NOT_FOUND', 'Admission application not found');
    const document = await this.prisma.admissionApplicationDocument.upsert({ where: { applicationId_requirementKey: { applicationId, requirementKey: dto.requirementKey } }, create: { tenantId: user.tenantId, schoolId: application.schoolId, applicationId, requirementKey: dto.requirementKey, label: dto.label, fileName: dto.fileName, mimeType: dto.mimeType, storageKey: dto.storageKey, fileSizeBytes: dto.fileSizeBytes === undefined ? undefined : BigInt(dto.fileSizeBytes), uploadedAt: new Date() }, update: { label: dto.label, fileName: dto.fileName, mimeType: dto.mimeType, storageKey: dto.storageKey, fileSizeBytes: dto.fileSizeBytes === undefined ? undefined : BigInt(dto.fileSizeBytes), uploadedAt: new Date(), reviewStatus: AdmissionDocumentReviewStatus.PENDING, reviewNote: null, reviewedAt: null, reviewedById: null } });
    await this.prisma.admissionApplicationEvent.create({ data: { tenantId: user.tenantId, schoolId: application.schoolId, applicationId, type: AdmissionEventType.DOCUMENT_UPLOADED, message: `${dto.label} uploaded`, metadata: { requirementKey: dto.requirementKey, documentId: document.id }, actorUserId: user.sub } });
    return document;
  }

  async reviewApplicationDocument(user: AuthenticatedUser, applicationId: string, documentId: string, dto: ReviewAdmissionDocumentDto) {
    const document = await this.prisma.admissionApplicationDocument.findFirst({ where: { id: documentId, applicationId, tenantId: user.tenantId } });
    if (!document) throw apiNotFound('ADMISSION_DOCUMENT_NOT_FOUND', 'Admission document not found');
    const updated = await this.prisma.admissionApplicationDocument.update({ where: { id: document.id }, data: { reviewStatus: dto.reviewStatus, reviewNote: dto.reviewNote, reviewedAt: new Date(), reviewedById: user.sub } });
    await this.prisma.admissionApplicationEvent.create({ data: { tenantId: user.tenantId, schoolId: document.schoolId, applicationId, type: dto.reviewStatus === AdmissionDocumentReviewStatus.VERIFIED ? AdmissionEventType.DOCUMENT_VERIFIED : AdmissionEventType.DOCUMENT_REJECTED, message: dto.reviewNote ?? `${document.label} marked ${dto.reviewStatus.toLowerCase()}`, metadata: { documentId: document.id }, actorUserId: user.sub } });
    return updated;
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

    const form = dto.formId
      ? await this.prisma.admissionForm.findFirst({ where: { id: dto.formId, tenantId: user.tenantId, schoolId: dto.schoolId, academicYearId: dto.academicYearId, status: AdmissionFormStatus.PUBLISHED }, include: { sections: { include: { fields: true } } } })
      : null;
    if (dto.formId && !form) throw apiNotFound('ADMISSION_FORM_NOT_FOUND', 'Published admission form not found for this school and academic year');
    if (form && status !== AdmissionStatus.DRAFT) this.validateFormData(dto.formData ?? {}, form.sections);

    const now = new Date();
    const created = await this.prisma.admissionApplication.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        campusId: dto.campusId,
        academicYearId: dto.academicYearId,
        classRoomId: dto.classRoomId,
        status,
        formId: form?.id,
        formVersion: form?.version,
        applicationNumber: `ADM-${now.getUTCFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        admissionCategory: dto.admissionCategory,
        applicationSource: dto.applicationSource,
        preferredLanguage: dto.preferredLanguage,
        formData: dto.formData as Prisma.InputJsonValue | undefined,
        termsVersion: dto.termsVersion ?? (form ? `v${form.version}` : undefined),
        parentAcknowledgedAt: status !== AdmissionStatus.DRAFT && dto.termsVersion ? now : undefined,
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

    await this.prisma.admissionApplicationEvent.create({ data: { tenantId: user.tenantId, schoolId: created.schoolId, applicationId: created.id, type: status === AdmissionStatus.SUBMITTED ? AdmissionEventType.SUBMITTED : AdmissionEventType.CREATED, toStatus: status, message: dto.applicationSource === 'OFFICE' ? 'Application entered by school office' : undefined, actorUserId: user.sub } });

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
        AdmissionStatus.INFO_REQUESTED,
        AdmissionStatus.WITHDRAWN,
      ],
      [AdmissionStatus.REVIEWING]: [
        AdmissionStatus.INFO_REQUESTED,
        AdmissionStatus.APPROVED,
        AdmissionStatus.WAITLISTED,
        AdmissionStatus.REJECTED,
        AdmissionStatus.WITHDRAWN,
      ],
      [AdmissionStatus.INFO_REQUESTED]: [AdmissionStatus.SUBMITTED, AdmissionStatus.REVIEWING, AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.APPROVED]: [AdmissionStatus.OFFERED, AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.WAITLISTED]: [AdmissionStatus.OFFERED, AdmissionStatus.REJECTED, AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.REJECTED]: [AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.OFFERED]: [AdmissionStatus.FEE_PENDING, AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.FEE_PENDING]: [AdmissionStatus.READY_FOR_ENROLLMENT, AdmissionStatus.WITHDRAWN],
      [AdmissionStatus.READY_FOR_ENROLLMENT]: [AdmissionStatus.ENROLLED, AdmissionStatus.WITHDRAWN],
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
      formId: row.formId,
      formVersion: row.formVersion,
      applicationNumber: row.applicationNumber,
      formData: (row.formData as Record<string, unknown> | null) ?? null,
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
      infoRequestedAt: row.infoRequestedAt ? row.infoRequestedAt.toISOString() : null,
      infoRequestMessage: row.infoRequestMessage,
      offerIssuedAt: row.offerIssuedAt ? row.offerIssuedAt.toISOString() : null,
      offerExpiresAt: row.offerExpiresAt ? row.offerExpiresAt.toISOString() : null,
      feesClearedAt: row.feesClearedAt ? row.feesClearedAt.toISOString() : null,
      finalVerifiedAt: row.finalVerifiedAt ? row.finalVerifiedAt.toISOString() : null,
      enrollmentConfirmedAt: row.enrollmentConfirmedAt ? row.enrollmentConfirmedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private async ensureSchoolYear(user: AuthenticatedUser, schoolId: string, academicYearId: string) {
    const exists = await this.prisma.academicYear.findFirst({ where: { id: academicYearId, schoolId, tenantId: user.tenantId, deletedAt: null }, select: { id: true } });
    if (!exists) throw apiNotFound('ADMISSION_FORM_SCHOOL_YEAR_NOT_FOUND', 'School or academic year not found');
  }

  private async ensureDraftForm(user: AuthenticatedUser, formId: string) {
    const form = await this.prisma.admissionForm.findFirst({ where: { id: formId, tenantId: user.tenantId, status: AdmissionFormStatus.DRAFT }, select: { id: true, schoolId: true, academicYearId: true } });
    if (!form) throw apiNotFound('ADMISSION_FORM_NOT_FOUND', 'Draft admission form not found');
    return form;
  }

  private validateFormData(data: Record<string, unknown>, sections: Array<{ fields: Array<{ key: string; label: string; isRequired: boolean; visibility: Prisma.JsonValue | null }> }>) {
    const missing = sections.flatMap((section) => section.fields.filter((field) => field.isRequired && this.isVisible(field.visibility, data) && !this.hasValue(data[field.key])).map((field) => field.label));
    if (missing.length > 0) throw apiUnprocessable('ADMISSION_REQUIRED_FIELDS_MISSING', 'Required admission fields are missing', { fields: missing });
  }

  private isVisible(visibility: Prisma.JsonValue | null, data: Record<string, unknown>) {
    if (!visibility || typeof visibility !== 'object' || Array.isArray(visibility)) return true;
    const rule = visibility as { field?: string; equals?: unknown };
    return !rule.field || data[rule.field] === rule.equals;
  }

  private hasValue(value: unknown) {
    return value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0);
  }

  private toFormResponse(row: any): AdmissionFormResponseDto {
    return { id: row.id, schoolId: row.schoolId, academicYearId: row.academicYearId, name: row.name, version: row.version, status: row.status, description: row.description, termsText: row.termsText, sections: (row.sections ?? []).map((section: any) => ({ id: section.id, title: section.title, description: section.description, sortOrder: section.sortOrder, fields: (section.fields ?? []).map((field: any) => ({ id: field.id, key: field.key, label: field.label, type: field.type, helpText: field.helpText, isRequired: field.isRequired, isSensitive: field.isSensitive, sortOrder: field.sortOrder, options: field.options, visibility: field.visibility, validation: field.validation })) })), documents: (row.documents ?? []).map((document: any) => ({ id: document.id, key: document.key, label: document.label, stage: document.stage, isRequired: document.isRequired, isSensitive: document.isSensitive, acceptedTypes: document.acceptedTypes, maxSizeMb: document.maxSizeMb })) };
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
