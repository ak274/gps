import { PrismaService } from '@gps/data-access-db';
import {
  Document,
  DocumentReviewStatus,
  NotificationTargetType,
  Prisma,
  TaskPriority,
  TaskType,
} from '@gps/data-access-prisma';
import { apiBadRequest, apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentAuditResponseDto } from './dto/document-audit-response.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { RunExpiryRemindersDto } from './dto/run-expiry-reminders.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(
    user: AuthenticatedUser,
    query: ListDocumentsQueryDto,
  ): Promise<DocumentResponseDto[]> {
    const where: Prisma.DocumentWhereInput = {
      tenantId: user.tenantId,
      deletedAt: null,
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(query.reviewStatus ? { reviewStatus: query.reviewStatus } : {}),
      ...(query.schoolId ? { schoolId: query.schoolId } : {}),
      ...(query.entityId ? { entityId: query.entityId } : {}),
      ...(query.category
        ? { category: { equals: query.category, mode: 'insensitive' } }
        : {}),
      ...(query.uploadedById ? { uploadedById: query.uploadedById } : {}),
      ...(query.search
        ? {
            OR: [
              { fileName: { contains: query.search, mode: 'insensitive' } },
              { storageKey: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const rows = await this.prisma.document.findMany({
      where,
      orderBy: [{ uploadedAt: 'desc' }],
    });

    return rows.map((row) => this.toResponse(row));
  }

  async findById(user: AuthenticatedUser, documentId: string): Promise<DocumentResponseDto> {
    const row = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
    });

    if (!row) {
      throw apiNotFound('DOCUMENT_NOT_FOUND', 'Document not found', { documentId });
    }

    return this.toResponse(row);
  }

  async audit(user: AuthenticatedUser, documentId: string): Promise<DocumentAuditResponseDto[]> {
    const document = await this.prisma.document.findFirst({ where: { id: documentId, tenantId: user.tenantId, deletedAt: null }, select: { id: true } });
    if (!document) throw apiNotFound('DOCUMENT_NOT_FOUND', 'Document not found', { documentId });
    const rows = await this.prisma.auditLog.findMany({ where: { tenantId: user.tenantId, entityId: documentId, entityType: { in: ['DOCUMENT', 'DOCUMENT_REVIEW'] }, deletedAt: null }, orderBy: { createdAt: 'desc' } });
    return rows.map((row) => ({ id: row.id, action: row.action, entityType: row.entityType, message: row.message, oldValues: (row.oldValues as Record<string, unknown> | null) ?? null, newValues: (row.newValues as Record<string, unknown> | null) ?? null, actorUserId: row.actorUserId, createdAt: row.createdAt.toISOString() }));
  }

  async create(user: AuthenticatedUser, dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    if (dto.schoolId) {
      const school = await this.prisma.school.findFirst({ where: { id: dto.schoolId, tenantId: user.tenantId, deletedAt: null }, select: { id: true } });
      if (!school) throw apiNotFound('SCHOOL_NOT_FOUND', 'School not found in the authenticated tenant');
    }
    const row = await this.prisma.document.create({
      data: {
        tenantId: user.tenantId,
        schoolId: dto.schoolId,
        entityType: dto.entityType,
        entityId: dto.entityId,
        category: dto.category,
        fileName: dto.fileName,
        mimeType: dto.mimeType,
        fileSizeBytes: BigInt(dto.fileSizeBytes),
        storageBucket: dto.storageBucket,
        storageKey: dto.storageKey,
        checksum: dto.checksum,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
        uploadedById: user.sub,
      },
    });
    await this.prisma.auditLog.create({ data: { tenantId: user.tenantId, actorUserId: user.sub, action: 'CREATE', entityType: 'DOCUMENT', entityId: row.id, message: `Document uploaded: ${row.fileName}`, newValues: { reviewStatus: row.reviewStatus, category: row.category } } });

    return this.toResponse(row);
  }

  async remove(user: AuthenticatedUser, documentId: string) {
    const row = await this.prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId: user.tenantId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!row) {
      throw apiNotFound('DOCUMENT_NOT_FOUND', 'Document not found', { documentId });
    }

    await this.prisma.document.update({
      where: { id: documentId },
      data: {
        deletedAt: new Date(),
        deletedById: user.sub,
      },
    });
    await this.prisma.auditLog.create({ data: { tenantId: user.tenantId, actorUserId: user.sub, action: 'DELETE', entityType: 'DOCUMENT', entityId: documentId, message: 'Document metadata soft deleted' } });

    return { success: true };
  }

  async review(
    user: AuthenticatedUser,
    documentId: string,
    dto: ReviewDocumentDto,
  ): Promise<DocumentResponseDto> {
    const row = await this.prisma.document.findFirst({
      where: { id: documentId, tenantId: user.tenantId, deletedAt: null },
    });
    if (!row) throw apiNotFound('DOCUMENT_NOT_FOUND', 'Document not found', { documentId });

    if (['REJECTED', 'NEEDS_INFORMATION'].includes(dto.status) && !dto.note?.trim()) {
      throw apiBadRequest('DOCUMENT_REVIEW_NOTE_REQUIRED', 'A note is required for this review outcome');
    }
    if (dto.status === DocumentReviewStatus.VERIFIED && dto.expiresAt && new Date(dto.expiresAt) <= new Date()) {
      throw apiBadRequest('DOCUMENT_EXPIRY_INVALID', 'Verified document expiry must be in the future');
    }

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: {
        reviewStatus: dto.status,
        reviewNote: dto.note?.trim() || null,
        reviewedAt: new Date(),
        reviewedById: user.sub,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : dto.status === DocumentReviewStatus.VERIFIED ? null : row.expiresAt,
      },
    });
    await this.prisma.auditLog.create({ data: { tenantId: user.tenantId, actorUserId: user.sub, action: 'UPDATE', entityType: 'DOCUMENT_REVIEW', entityId: row.id, message: `Document review changed to ${dto.status}`, oldValues: { reviewStatus: row.reviewStatus, reviewNote: row.reviewNote }, newValues: { reviewStatus: updated.reviewStatus, reviewNote: updated.reviewNote, expiresAt: updated.expiresAt?.toISOString() ?? null } } });
    return this.toResponse(updated);
  }

  async runExpiryReminders(user: AuthenticatedUser, dto: RunExpiryRemindersDto): Promise<{ expired: number; tasksCreated: number }> {
    const now = new Date();
    const horizon = new Date(now.getTime() + dto.days * 24 * 60 * 60 * 1000);
    const expired = await this.prisma.document.updateMany({ where: { tenantId: user.tenantId, deletedAt: null, reviewStatus: DocumentReviewStatus.VERIFIED, expiresAt: { lt: now } }, data: { reviewStatus: DocumentReviewStatus.EXPIRED } });
    const due = await this.prisma.document.findMany({ where: { tenantId: user.tenantId, deletedAt: null, reviewStatus: DocumentReviewStatus.VERIFIED, expiresAt: { gte: now, lte: horizon }, schoolId: { not: null } }, take: 200 });
    let tasksCreated = 0;
    for (const document of due) {
      const existing = await this.prisma.task.findFirst({ where: { tenantId: user.tenantId, sourceType: 'DOCUMENT_EXPIRY', sourceId: document.id, status: { notIn: ['COMPLETED', 'CANCELLED'] } }, select: { id: true } });
      if (existing || !document.schoolId) continue;
      const assigneeId = document.uploadedById ?? user.sub;
      await this.prisma.$transaction(async (tx) => {
        await tx.task.create({ data: { tenantId: user.tenantId, schoolId: document.schoolId!, title: `Renew document: ${document.fileName}`, description: `This document expires on ${document.expiresAt?.toISOString().slice(0, 10)}. Upload a replacement and review it before expiry.`, type: TaskType.DOCUMENT_REVIEW, priority: TaskPriority.HIGH, assigneeId, createdById: user.sub, sourceType: 'DOCUMENT_EXPIRY', sourceId: document.id, dueAt: document.expiresAt } });
        await tx.notification.create({ data: { tenantId: user.tenantId, schoolId: document.schoolId!, title: 'Document renewal due', messageBody: `${document.fileName} expires soon.`, senderId: user.sub, targetType: NotificationTargetType.USER, targetId: assigneeId, reads: { create: { tenantId: user.tenantId, userId: assigneeId } } } });
      });
      tasksCreated += 1;
    }
    return { expired: expired.count, tasksCreated };
  }

  private toResponse(row: Document): DocumentResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
      schoolId: row.schoolId,
      entityType: row.entityType,
      entityId: row.entityId,
      category: row.category,
      fileName: row.fileName,
      mimeType: row.mimeType,
      fileSizeBytes: row.fileSizeBytes.toString(),
      storageBucket: row.storageBucket,
      storageKey: row.storageKey,
      checksum: row.checksum,
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
      uploadedById: row.uploadedById,
      uploadedAt: row.uploadedAt.toISOString(),
      reviewStatus: row.reviewStatus,
      reviewNote: row.reviewNote,
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      reviewedById: row.reviewedById,
      expiresAt: row.expiresAt?.toISOString() ?? null,
      downloadUrl: this.buildDownloadUrl(row),
    };
  }

  private buildDownloadUrl(row: Document): string {
    if (row.storageBucket) {
      return `s3://${row.storageBucket}/${row.storageKey}`;
    }

    return row.storageKey;
  }
}
