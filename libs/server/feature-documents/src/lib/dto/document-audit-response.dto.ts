import { AuditAction } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentAuditResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty({ enum: AuditAction }) action!: AuditAction;
  @ApiProperty() entityType!: string;
  @ApiPropertyOptional() message!: string | null;
  @ApiPropertyOptional({ type: 'object', additionalProperties: true }) oldValues!: Record<string, unknown> | null;
  @ApiPropertyOptional({ type: 'object', additionalProperties: true }) newValues!: Record<string, unknown> | null;
  @ApiPropertyOptional() actorUserId!: string | null;
  @ApiProperty() createdAt!: string;
}
