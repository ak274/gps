import { PrismaService } from '@gps/data-access-db';
import {
  Document,
  Prisma,
} from '@gps/data-access-prisma';
import { apiNotFound } from '@gps/server-errors';
import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { ListDocumentsQueryDto } from './dto/list-documents-query.dto';

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

  async create(user: AuthenticatedUser, dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    const row = await this.prisma.document.create({
      data: {
        tenantId: user.tenantId,
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

    return { success: true };
  }

  private toResponse(row: Document): DocumentResponseDto {
    return {
      id: row.id,
      tenantId: row.tenantId,
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
