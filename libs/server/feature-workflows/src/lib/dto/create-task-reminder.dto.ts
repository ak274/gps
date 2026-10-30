import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskReminderDto {
  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  remindAt!: string;

  @ApiPropertyOptional({ description: 'Defaults to the task assignee or current user' })
  @IsOptional()
  @IsString()
  userId?: string;
}
