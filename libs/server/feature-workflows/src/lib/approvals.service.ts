import { PrismaService } from '@gps/data-access-db';
import { ApprovalStatus, ApprovalStepStatus, MembershipStatus, NotificationTargetType, Prisma } from '@gps/data-access-prisma';
import { apiBadRequest, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateApprovalRequestDto } from './dto/create-approval-request.dto';
import { DecideApprovalDto } from './dto/decide-approval.dto';
import { ApprovalResponseDto } from './dto/approval-response.dto';

@Injectable()
export class ApprovalsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthenticatedUser, schoolId?: string): Promise<ApprovalResponseDto[]> {
    const rows = await this.prisma.approvalRequest.findMany({
      where: { tenantId: user.tenantId, deletedAt: null, ...(schoolId ? { schoolId } : {}) },
      include: { steps: { include: { assignee: { select: { firstName: true, lastName: true } } }, orderBy: { sequence: 'asc' } } },
      orderBy: [{ createdAt: 'desc' }],
    });
    return rows.map((row) => this.toResponse(row));
  }

  async create(user: AuthenticatedUser, dto: CreateApprovalRequestDto): Promise<ApprovalResponseDto> {
    const school = await this.prisma.school.findFirst({ where: { id: dto.schoolId, tenantId: user.tenantId, deletedAt: null } });
    if (!school) throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found in the authenticated tenant');
    const approverIds = [...new Set(dto.approverIds)];
    const memberships = await this.prisma.userTenant.findMany({ where: { tenantId: user.tenantId, userId: { in: approverIds }, status: MembershipStatus.ACTIVE, deletedAt: null }, select: { userId: true } });
    const allowed = new Set(memberships.map((row) => row.userId));
    const invalid = approverIds.filter((id) => !allowed.has(id));
    if (invalid.length) throw apiBadRequest('APPROVAL_APPROVER_NOT_ACTIVE', 'All approvers must be active in the authenticated tenant', { invalidApproverIds: invalid });
    const request = await this.prisma.$transaction(async (tx) => {
      const created = await tx.approvalRequest.create({
        data: {
          tenantId: user.tenantId,
          schoolId: dto.schoolId,
          title: dto.title,
          description: dto.description,
          entityType: dto.entityType,
          entityId: dto.entityId,
          requestedById: user.sub,
          dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
          status: ApprovalStatus.IN_REVIEW,
          steps: { create: approverIds.map((assigneeId, index) => ({ assigneeId, sequence: index + 1, status: index === 0 ? ApprovalStepStatus.ACTIVE : ApprovalStepStatus.PENDING })) },
        },
      });
      const firstApprover = approverIds[0];
      await tx.task.create({ data: { tenantId: user.tenantId, schoolId: dto.schoolId, title: dto.title, description: dto.description, type: 'APPROVAL', priority: 'HIGH', assigneeId: firstApprover, createdById: user.sub, sourceType: 'APPROVAL_REQUEST', sourceId: created.id, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined } });
      await tx.notification.create({ data: { tenantId: user.tenantId, schoolId: dto.schoolId, title: 'Approval requested', messageBody: dto.title, senderId: user.sub, targetType: NotificationTargetType.USER, targetId: firstApprover, reads: { create: { tenantId: user.tenantId, userId: firstApprover } } } });
      return tx.approvalRequest.findUniqueOrThrow({ where: { id: created.id }, include: { steps: { include: { assignee: { select: { firstName: true, lastName: true } } }, orderBy: { sequence: 'asc' } } } });
    });
    return this.toResponse(request);
  }

  async decide(user: AuthenticatedUser, requestId: string, dto: DecideApprovalDto): Promise<ApprovalResponseDto> {
    const request = await this.prisma.approvalRequest.findFirst({ where: { id: requestId, tenantId: user.tenantId, deletedAt: null }, include: { steps: { orderBy: { sequence: 'asc' } } } });
    if (!request) throw apiNotFound('APPROVAL_REQUEST_NOT_FOUND', 'Approval request not found');
    const active = request.steps.find((step) => step.status === ApprovalStepStatus.ACTIVE && step.assigneeId === user.sub);
    if (!active) throw apiBadRequest('APPROVAL_NOT_ASSIGNED', 'The current approval step is not assigned to you');
    const statusMap = { APPROVE: ApprovalStepStatus.APPROVED, REJECT: ApprovalStepStatus.REJECTED, REQUEST_CHANGES: ApprovalStepStatus.CHANGES_REQUESTED } as const;
    const stepStatus = statusMap[dto.decision];
    await this.prisma.$transaction(async (tx) => {
      await tx.approvalStep.update({ where: { id: active.id }, data: { status: stepStatus, decisionNote: dto.note, decidedAt: new Date(), decidedById: user.sub } });
      if (dto.decision === 'APPROVE') {
        const next = request.steps.find((step) => step.sequence > active.sequence && step.status === ApprovalStepStatus.PENDING);
        if (next) {
          await tx.approvalStep.update({ where: { id: next.id }, data: { status: ApprovalStepStatus.ACTIVE } });
          await tx.task.create({ data: { tenantId: user.tenantId, schoolId: request.schoolId, title: request.title, description: request.description, type: 'APPROVAL', priority: 'HIGH', assigneeId: next.assigneeId, createdById: user.sub, sourceType: 'APPROVAL_REQUEST', sourceId: request.id, dueAt: request.dueAt ?? undefined } });
          await tx.notification.create({ data: { tenantId: user.tenantId, schoolId: request.schoolId, title: 'Approval step ready', messageBody: request.title, senderId: user.sub, targetType: NotificationTargetType.USER, targetId: next.assigneeId, reads: { create: { tenantId: user.tenantId, userId: next.assigneeId } } } });
          await tx.approvalRequest.update({ where: { id: request.id }, data: { status: ApprovalStatus.IN_REVIEW } });
        } else {
          await tx.approvalRequest.update({ where: { id: request.id }, data: { status: ApprovalStatus.APPROVED, completedAt: new Date() } });
        }
      } else {
        await tx.approvalRequest.update({ where: { id: request.id }, data: { status: dto.decision === 'REJECT' ? ApprovalStatus.REJECTED : ApprovalStatus.CHANGES_REQUESTED, completedAt: new Date() } });
      }
    });
    return this.getById(user, requestId);
  }

  async getById(user: AuthenticatedUser, id: string) {
    const row = await this.prisma.approvalRequest.findFirst({ where: { id, tenantId: user.tenantId, deletedAt: null }, include: { steps: { include: { assignee: { select: { firstName: true, lastName: true } } }, orderBy: { sequence: 'asc' } } } });
    if (!row) throw apiNotFound('APPROVAL_REQUEST_NOT_FOUND', 'Approval request not found');
    return this.toResponse(row);
  }

  private toResponse(row: Prisma.ApprovalRequestGetPayload<{ include: { steps: { include: { assignee: { select: { firstName: true; lastName: true } } } } } }>): ApprovalResponseDto {
    return { id: row.id, schoolId: row.schoolId, title: row.title, description: row.description, status: row.status, entityType: row.entityType, entityId: row.entityId, requestedById: row.requestedById, dueAt: row.dueAt?.toISOString() ?? null, createdAt: row.createdAt.toISOString(), steps: row.steps.map((step) => ({ id: step.id, sequence: step.sequence, assigneeId: step.assigneeId, assigneeName: `${step.assignee.firstName} ${step.assignee.lastName ?? ''}`.trim(), status: step.status, decisionNote: step.decisionNote, decidedAt: step.decidedAt?.toISOString() ?? null })) };
  }
}
