import { NotificationTargetType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  messageBody!: string;

  @ApiPropertyOptional()
  senderId!: string | null;

  @ApiProperty({ enum: NotificationTargetType })
  targetType!: NotificationTargetType;

  @ApiPropertyOptional()
  targetId!: string | null;

  @ApiPropertyOptional({ description: 'ISO datetime string' })
  scheduledFor!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty()
  isRead!: boolean;

  @ApiPropertyOptional({ description: 'ISO datetime string' })
  readAt!: string | null;
}
