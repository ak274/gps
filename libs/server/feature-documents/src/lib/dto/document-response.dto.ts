import { DocumentEntityType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty({ enum: DocumentEntityType })
  entityType!: DocumentEntityType;

  @ApiProperty()
  entityId!: string;

  @ApiProperty()
  category!: string;

  @ApiProperty()
  fileName!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty({ description: 'File size in bytes as string to keep bigint-safe transport' })
  fileSizeBytes!: string;

  @ApiPropertyOptional()
  storageBucket!: string | null;

  @ApiProperty()
  storageKey!: string;

  @ApiPropertyOptional()
  checksum!: string | null;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  metadata!: Record<string, unknown> | null;

  @ApiPropertyOptional()
  uploadedById!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  uploadedAt!: string;

  @ApiProperty({ description: 'Storage provider URL or signed URL placeholder' })
  downloadUrl!: string;
}
