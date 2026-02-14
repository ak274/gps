import { NotificationTargetType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 180)
  title!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 4000)
  messageBody!: string;

  @ApiProperty({ enum: NotificationTargetType })
  @IsEnum(NotificationTargetType)
  targetType!: NotificationTargetType;

  @ApiPropertyOptional({ description: 'Context target id (e.g. userId/classRoomId) based on targetType' })
  @ValidateIf((o: CreateNotificationDto) => o.targetType === NotificationTargetType.USER)
  @IsString()
  targetId?: string;

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @ApiPropertyOptional({ type: [String], description: 'Users to seed as recipients in user_notifications' })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  recipientUserIds?: string[];
}
