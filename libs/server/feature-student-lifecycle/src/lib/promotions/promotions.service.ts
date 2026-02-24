import { PrismaService } from '@gps/data-access-db';
import {
  EnrollmentStatus,
  PromotionAction,
  PromotionBatch,
  PromotionBatchStatus,
  PromotionDecision,
  Prisma,
} from '@gps/data-access-prisma';
import { apiNotFound, apiUnprocessable } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreatePromotionBatchDto } from './dto/create-promotion-batch.dto';
import { PromotionBatchResponseDto } from './dto/promotion-batch-response.dto';
import { PromotionBatchPreviewResponseDto } from './dto/promotion-batch-preview-response.dto';
import { UpdatePromotionMappingsDto } from './dto/update-promotion-mappings.dto';
import { UpdatePromotionOverridesDto } from './dto/update-promotion-overrides.dto';
import { PromotionLetterResponseDto } from './dto/promotion-letters-response.dto';

type ClassKey = `${string}|${string}`; // gradeLevel|section

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBatch(user: AuthenticatedUser, dto: CreatePromotionBatchDto): Promise<PromotionBatchResponseDto> {
    const created = await this.prisma.promotionBatch.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        fromAcademicYearId: dto.fromAcademicYearId,
        toAcademicYearId: dto.toAcademicYearId,
        status: PromotionBatchStatus.DRAFT,
        createdById: user.sub,
        updatedById: user.sub,
      },
    });

    if (dto.autoCreateMappings !== false) {
      await this.autoCreateMappings(user, created.id);
    }

    return this.toBatchResponse(created);
  }

  async listBatches(user: AuthenticatedUser, schoolId?: string): Promise<PromotionBatchResponseDto[]> {
    const rows = await this.prisma.promotionBatch.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(schoolId ? { schoolId } : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return rows.map((r) => this.toBatchResponse(r));
  }

  async findBatchById(user: AuthenticatedUser, batchId: string): Promise<PromotionBatchResponseDto> {
    const row = await this.prisma.promotionBatch.findFirst({
      where: { id: batchId, tenantId: user.tenantId, deletedAt: null },
    });
    if (!row) {
      throw apiNotFound('PROMOTION_BATCH_NOT_FOUND', 'Promotion batch not found', { batchId });
    }
    return this.toBatchResponse(row);
  }

  async updateMappings(
    user: AuthenticatedUser,
    batchId: string,
    dto: UpdatePromotionMappingsDto,
  ): Promise<{ success: true }> {
    await this.ensureBatchEditable(user, batchId);

    const existing = await this.prisma.promotionMapping.findMany({
      where: { tenantId: user.tenantId, batchId, deletedAt: null },
      select: { id: true, fromClassRoomId: true },
    });
    const existingByFrom = new Map(existing.map((m) => [m.fromClassRoomId, m.id]));

    await this.prisma.$transaction(
      dto.mappings.map((m) => {
        const id = existingByFrom.get(m.fromClassRoomId);
        if (id) {
          return this.prisma.promotionMapping.update({
            where: { id },
            data: {
              action: m.action,
              toClassRoomId: m.toClassRoomId ?? null,
              updatedById: user.sub,
            },
          });
        }
        return this.prisma.promotionMapping.create({
          data: {
            tenantId: user.tenantId,
            batchId,
            fromClassRoomId: m.fromClassRoomId,
            toClassRoomId: m.toClassRoomId ?? null,
            action: m.action,
            createdById: user.sub,
            updatedById: user.sub,
          },
        });
      }),
    );

    return { success: true };
  }

  async updateOverrides(
    user: AuthenticatedUser,
    batchId: string,
    dto: UpdatePromotionOverridesDto,
  ): Promise<{ success: true }> {
    await this.ensureBatchEditable(user, batchId);

    const existing = await this.prisma.promotionStudentOverride.findMany({
      where: { tenantId: user.tenantId, batchId, deletedAt: null },
      select: { id: true, studentId: true },
    });
    const existingByStudent = new Map(existing.map((o) => [o.studentId, o.id]));

    await this.prisma.$transaction(
      dto.overrides.map((o) => {
        const id = existingByStudent.get(o.studentId);
        if (id) {
          return this.prisma.promotionStudentOverride.update({
            where: { id },
            data: {
              decision: o.decision,
              toClassRoomId: o.toClassRoomId ?? null,
              remarks: o.remarks ?? null,
              updatedById: user.sub,
            },
          });
        }
        return this.prisma.promotionStudentOverride.create({
          data: {
            tenantId: user.tenantId,
            batchId,
            studentId: o.studentId,
            decision: o.decision,
            toClassRoomId: o.toClassRoomId ?? null,
            remarks: o.remarks ?? null,
            createdById: user.sub,
            updatedById: user.sub,
          },
        });
      }),
    );

    return { success: true };
  }

  async preview(user: AuthenticatedUser, batchId: string): Promise<PromotionBatchPreviewResponseDto> {
    const batch = await this.getBatchOrThrow(user, batchId);

    const [fromClasses, toClasses] = await this.prisma.$transaction([
      this.prisma.classRoom.findMany({
        where: {
          tenantId: user.tenantId,
          schoolId: batch.schoolId,
          academicYearId: batch.fromAcademicYearId,
          deletedAt: null,
        },
        orderBy: [{ gradeLevel: 'asc' }, { section: 'asc' }, { name: 'asc' }],
        select: { id: true, gradeLevel: true, section: true },
      }),
      this.prisma.classRoom.findMany({
        where: {
          tenantId: user.tenantId,
          schoolId: batch.schoolId,
          academicYearId: batch.toAcademicYearId,
          deletedAt: null,
        },
        select: { id: true, gradeLevel: true, section: true },
      }),
    ]);

    const toByKey = new Map<ClassKey, string>();
    for (const c of toClasses) {
      const key: ClassKey = `${c.gradeLevel}|${c.section ?? ''}`;
      toByKey.set(key, c.id);
    }

    const mappings = await this.prisma.promotionMapping.findMany({
      where: { tenantId: user.tenantId, batchId, deletedAt: null },
      select: { fromClassRoomId: true, toClassRoomId: true, action: true },
    });
    const mappingByFrom = new Map(mappings.map((m) => [m.fromClassRoomId, m]));

    const overrides = await this.prisma.promotionStudentOverride.findMany({
      where: { tenantId: user.tenantId, batchId, deletedAt: null },
      select: { studentId: true, decision: true, toClassRoomId: true, remarks: true },
    });
    const overrideByStudent = new Map(overrides.map((o) => [o.studentId, o]));

    // Load active enrollments in the from-year, along with minimal student identity.
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId: user.tenantId,
        academicYearId: batch.fromAcademicYearId,
        status: EnrollmentStatus.ACTIVE,
        deletedAt: null,
        student: { schoolId: batch.schoolId, deletedAt: null },
      },
      select: {
        id: true,
        studentId: true,
        classRoomId: true,
        student: { select: { admissionNo: true, firstName: true, lastName: true } },
      },
      orderBy: [{ createdAt: 'asc' }],
    });

    const byClass = new Map<string, typeof enrollments>();
    for (const e of enrollments) {
      const list = byClass.get(e.classRoomId) ?? [];
      list.push(e);
      byClass.set(e.classRoomId, list);
    }

    const classes = fromClasses.map((c) => {
      const mapping = mappingByFrom.get(c.id);
      const action = mapping?.action ?? PromotionAction.PROMOTE;
      const toClassRoomId = mapping?.toClassRoomId ?? this.suggestNextClassRoomId(c.gradeLevel, c.section, toByKey);
      const students = (byClass.get(c.id) ?? []).map((e) => {
        const o = overrideByStudent.get(e.studentId);
        const decision = o?.decision ?? this.defaultDecisionForMapping(action, toClassRoomId);
        const targetClassRoomId = this.resolveTargetClassRoomId({
          decision,
          overrideToClassRoomId: o?.toClassRoomId ?? null,
          mappingToClassRoomId: toClassRoomId,
          detainTargetId: this.suggestSameClassRoomId(c.gradeLevel, c.section, toByKey),
        });
        const isEligible =
          decision === PromotionDecision.GRADUATE ||
          decision === PromotionDecision.EXIT ||
          decision === PromotionDecision.TRANSFER ||
          Boolean(targetClassRoomId);
        return {
          studentId: e.studentId,
          admissionNo: e.student.admissionNo,
          firstName: e.student.firstName,
          lastName: e.student.lastName ?? null,
          isEligible,
          ineligibleReason: isEligible ? null : 'NO_TARGET_CLASSROOM',
          decision,
          targetClassRoomId,
          remarks: o?.remarks ?? null,
        };
      });

      return {
        fromClassRoomId: c.id,
        fromGradeLevel: c.gradeLevel,
        fromSection: c.section ?? null,
        action,
        toClassRoomId: toClassRoomId ?? null,
        students,
      };
    });

    return { batchId, classes };
  }

  async letters(user: AuthenticatedUser, batchId: string): Promise<PromotionLetterResponseDto[]> {
    const batch = await this.getBatchOrThrow(user, batchId);
    const preview = await this.preview(user, batchId);

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId: user.tenantId,
        academicYearId: batch.fromAcademicYearId,
        status: EnrollmentStatus.ACTIVE,
        deletedAt: null,
        student: { schoolId: batch.schoolId, deletedAt: null },
      },
      select: {
        studentId: true,
        classRoomId: true,
        student: { select: { admissionNo: true, firstName: true, lastName: true } },
      },
    });

    const byStudent = new Map(enrollments.map((e) => [e.studentId, e]));
    const issuedAt = new Date().toISOString();

    const letters: PromotionLetterResponseDto[] = [];
    for (const c of preview.classes) {
      for (const s of c.students) {
        const e = byStudent.get(s.studentId);
        if (!e) continue;
        letters.push({
          studentId: s.studentId,
          admissionNo: e.student.admissionNo,
          studentName: `${e.student.firstName}${e.student.lastName ? ` ${e.student.lastName}` : ''}`,
          schoolId: batch.schoolId,
          fromAcademicYearId: batch.fromAcademicYearId,
          toAcademicYearId: batch.toAcademicYearId,
          fromClassRoomId: e.classRoomId,
          toClassRoomId: s.targetClassRoomId,
          decision: s.decision,
          issuedAt,
        });
      }
    }

    return letters;
  }

  async apply(
    user: AuthenticatedUser,
    batchId: string,
  ): Promise<{ success: true; promotedCount: number; detainedCount: number; graduatedCount: number; skippedCount: number }> {
    const batch = await this.getBatchOrThrow(user, batchId);
    if (batch.status !== PromotionBatchStatus.DRAFT) {
      throw apiUnprocessable('PROMOTION_BATCH_NOT_EDITABLE', 'Promotion batch is not editable', {
        batchId,
        status: batch.status,
      });
    }

    const [fromYear, toYear] = await this.prisma.$transaction([
      this.prisma.academicYear.findFirst({
        where: { id: batch.fromAcademicYearId, tenantId: user.tenantId, schoolId: batch.schoolId, deletedAt: null },
        select: { id: true, endsOn: true },
      }),
      this.prisma.academicYear.findFirst({
        where: { id: batch.toAcademicYearId, tenantId: user.tenantId, schoolId: batch.schoolId, deletedAt: null },
        select: { id: true, startsOn: true },
      }),
    ]);
    if (!fromYear || !toYear) {
      throw apiUnprocessable('PROMOTION_YEAR_INVALID', 'Academic years are invalid for this batch', {
        batchId,
        fromAcademicYearId: batch.fromAcademicYearId,
        toAcademicYearId: batch.toAcademicYearId,
      });
    }

    const toClasses = await this.prisma.classRoom.findMany({
      where: {
        tenantId: user.tenantId,
        schoolId: batch.schoolId,
        academicYearId: batch.toAcademicYearId,
        deletedAt: null,
      },
      select: { id: true, gradeLevel: true, section: true },
    });
    const toByKey = new Map<ClassKey, string>();
    for (const c of toClasses) {
      const key: ClassKey = `${c.gradeLevel}|${c.section ?? ''}`;
      toByKey.set(key, c.id);
    }

    const mappingRows = await this.prisma.promotionMapping.findMany({
      where: { tenantId: user.tenantId, batchId, deletedAt: null },
      select: { fromClassRoomId: true, toClassRoomId: true, action: true },
    });
    const mappingByFrom = new Map(mappingRows.map((m) => [m.fromClassRoomId, m]));

    const overrideRows = await this.prisma.promotionStudentOverride.findMany({
      where: { tenantId: user.tenantId, batchId, deletedAt: null },
      select: { studentId: true, decision: true, toClassRoomId: true },
    });
    const overrideByStudent = new Map(overrideRows.map((o) => [o.studentId, o]));

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        tenantId: user.tenantId,
        academicYearId: batch.fromAcademicYearId,
        status: EnrollmentStatus.ACTIVE,
        deletedAt: null,
        student: { schoolId: batch.schoolId, deletedAt: null },
        classRoom: { deletedAt: null },
      },
      select: {
        id: true,
        studentId: true,
        classRoomId: true,
        classRoom: { select: { gradeLevel: true, section: true } },
      },
    });

    let promotedCount = 0;
    let detainedCount = 0;
    let graduatedCount = 0;
    let skippedCount = 0;

    const leftOn = fromYear.endsOn;
    const enrolledOn = toYear.startsOn;

    const ops: Prisma.PrismaPromise<unknown>[] = [];

    for (const e of enrollments) {
      const mapping = mappingByFrom.get(e.classRoomId);
      const action = mapping?.action ?? PromotionAction.PROMOTE;
      const mappingToId =
        mapping?.toClassRoomId ?? this.suggestNextClassRoomId(e.classRoom.gradeLevel, e.classRoom.section, toByKey);
      const o = overrideByStudent.get(e.studentId);

      const decision = o?.decision ?? this.defaultDecisionForMapping(action, mappingToId);
      const targetClassRoomId = this.resolveTargetClassRoomId({
        decision,
        overrideToClassRoomId: o?.toClassRoomId ?? null,
        mappingToClassRoomId: mappingToId,
        detainTargetId: this.suggestSameClassRoomId(e.classRoom.gradeLevel, e.classRoom.section, toByKey),
      });

      if (decision === PromotionDecision.PROMOTE || decision === PromotionDecision.DETAIN) {
        if (!targetClassRoomId) {
          // No target configured; skip but keep in auditable state.
          skippedCount++;
          continue;
        }

        if (decision === PromotionDecision.PROMOTE) promotedCount++;
        if (decision === PromotionDecision.DETAIN) detainedCount++;

        ops.push(
          this.prisma.enrollment.create({
            data: {
              tenantId: user.tenantId,
              studentId: e.studentId,
              classRoomId: targetClassRoomId,
              academicYearId: batch.toAcademicYearId,
              status: EnrollmentStatus.ACTIVE,
              enrolledOn,
              createdById: user.sub,
              updatedById: user.sub,
            },
          }),
        );
        ops.push(
          this.prisma.enrollment.update({
            where: { id: e.id },
            data: {
              status: EnrollmentStatus.COMPLETED,
              leftOn,
              updatedById: user.sub,
            },
          }),
        );
        ops.push(
          this.prisma.student.update({
            where: { id: e.studentId },
            data: { currentStatus: EnrollmentStatus.ACTIVE, updatedById: user.sub },
          }),
        );
        continue;
      }

      if (decision === PromotionDecision.GRADUATE) {
        graduatedCount++;
        ops.push(
          this.prisma.enrollment.update({
            where: { id: e.id },
            data: {
              status: EnrollmentStatus.COMPLETED,
              leftOn,
              updatedById: user.sub,
            },
          }),
        );
        ops.push(
          this.prisma.student.update({
            where: { id: e.studentId },
            data: { currentStatus: EnrollmentStatus.COMPLETED, updatedById: user.sub },
          }),
        );
        continue;
      }

      // EXIT/TRANSFER are handled by exit requests. We just skip here.
      skippedCount++;
    }

    await this.prisma.$transaction([
      ...ops,
      this.prisma.promotionBatch.update({
        where: { id: batchId },
        data: {
          status: PromotionBatchStatus.APPLIED,
          appliedAt: new Date(),
          updatedById: user.sub,
        },
      }),
    ]);

    return { success: true, promotedCount, detainedCount, graduatedCount, skippedCount };
  }

  private async autoCreateMappings(user: AuthenticatedUser, batchId: string): Promise<void> {
    const batch = await this.getBatchOrThrow(user, batchId);

    const [fromClasses, toClasses] = await this.prisma.$transaction([
      this.prisma.classRoom.findMany({
        where: {
          tenantId: user.tenantId,
          schoolId: batch.schoolId,
          academicYearId: batch.fromAcademicYearId,
          deletedAt: null,
        },
        select: { id: true, gradeLevel: true, section: true },
      }),
      this.prisma.classRoom.findMany({
        where: {
          tenantId: user.tenantId,
          schoolId: batch.schoolId,
          academicYearId: batch.toAcademicYearId,
          deletedAt: null,
        },
        select: { id: true, gradeLevel: true, section: true },
      }),
    ]);

    const toByKey = new Map<ClassKey, string>();
    for (const c of toClasses) {
      const key: ClassKey = `${c.gradeLevel}|${c.section ?? ''}`;
      toByKey.set(key, c.id);
    }

    await this.prisma.promotionMapping.createMany({
      data: fromClasses.map((c) => {
        const toId = this.suggestNextClassRoomId(c.gradeLevel, c.section, toByKey);
        return {
          tenantId: user.tenantId,
          batchId,
          fromClassRoomId: c.id,
          toClassRoomId: toId,
          action: toId ? PromotionAction.PROMOTE : PromotionAction.GRADUATE,
          createdById: user.sub,
          updatedById: user.sub,
        };
      }),
      skipDuplicates: true,
    });
  }

  private suggestNextClassRoomId(
    gradeLevel: string,
    section: string | null,
    toByKey: Map<ClassKey, string>,
  ): string | null {
    const next = this.parseNumericGrade(gradeLevel);
    if (next === null) return null;
    const key: ClassKey = `${String(next + 1)}|${section ?? ''}`;
    return toByKey.get(key) ?? null;
  }

  private suggestSameClassRoomId(
    gradeLevel: string,
    section: string | null,
    toByKey: Map<ClassKey, string>,
  ): string | null {
    const key: ClassKey = `${gradeLevel}|${section ?? ''}`;
    return toByKey.get(key) ?? null;
  }

  private parseNumericGrade(gradeLevel: string): number | null {
    const n = Number.parseInt(gradeLevel, 10);
    return Number.isFinite(n) ? n : null;
  }

  private defaultDecisionForMapping(action: PromotionAction, mappingToClassRoomId: string | null): PromotionDecision {
    if (action === PromotionAction.GRADUATE) return PromotionDecision.GRADUATE;
    return mappingToClassRoomId ? PromotionDecision.PROMOTE : PromotionDecision.GRADUATE;
  }

  private resolveTargetClassRoomId(params: {
    decision: PromotionDecision;
    overrideToClassRoomId: string | null;
    mappingToClassRoomId: string | null;
    detainTargetId: string | null;
  }): string | null {
    if (params.decision === PromotionDecision.PROMOTE) {
      return params.overrideToClassRoomId ?? params.mappingToClassRoomId ?? null;
    }
    if (params.decision === PromotionDecision.DETAIN) {
      return params.overrideToClassRoomId ?? params.detainTargetId ?? null;
    }
    return null;
  }

  private async ensureBatchEditable(user: AuthenticatedUser, batchId: string): Promise<void> {
    const batch = await this.getBatchOrThrow(user, batchId);
    if (batch.status !== PromotionBatchStatus.DRAFT) {
      throw apiUnprocessable('PROMOTION_BATCH_NOT_EDITABLE', 'Promotion batch is not editable', {
        batchId,
        status: batch.status,
      });
    }
  }

  private async getBatchOrThrow(user: AuthenticatedUser, batchId: string): Promise<PromotionBatch> {
    const batch = await this.prisma.promotionBatch.findFirst({
      where: { id: batchId, tenantId: user.tenantId, deletedAt: null },
    });
    if (!batch) {
      throw apiNotFound('PROMOTION_BATCH_NOT_FOUND', 'Promotion batch not found', { batchId });
    }
    return batch;
  }

  private toBatchResponse(row: PromotionBatch): PromotionBatchResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      fromAcademicYearId: row.fromAcademicYearId,
      toAcademicYearId: row.toAcademicYearId,
      status: row.status,
      appliedAt: row.appliedAt ? row.appliedAt.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
