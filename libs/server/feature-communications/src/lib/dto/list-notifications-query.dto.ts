import { NotificationTargetType } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';

export class ListNotificationsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ enum: NotificationTargetType })
  @IsOptional()
  @IsEnum(NotificationTargetType)
  targetType?: NotificationTargetType;

  @ApiPropertyOptional({ description: 'Filter by current-user read status (true/false)' })
  @IsOptional()
  @IsBooleanString()
  isRead?: string;

  @ApiPropertyOptional({ description: 'Limit to notifications relevant to current user', default: 'true' })
  @IsOptional()
  @IsBooleanString()
  mineOnly?: string;
}
