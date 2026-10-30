import { TaskPriority, TaskStatus, TaskType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() schoolId!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description!: string | null;
  @ApiProperty({ enum: TaskType }) type!: TaskType;
  @ApiProperty({ enum: TaskStatus }) status!: TaskStatus;
  @ApiProperty({ enum: TaskPriority }) priority!: TaskPriority;
  @ApiPropertyOptional() assigneeId!: string | null;
  @ApiPropertyOptional() assigneeName!: string | null;
  @ApiProperty() createdById!: string;
  @ApiPropertyOptional() sourceType!: string | null;
  @ApiPropertyOptional() sourceId!: string | null;
  @ApiPropertyOptional() actionUrl!: string | null;
  @ApiPropertyOptional() dueAt!: string | null;
  @ApiPropertyOptional() completedAt!: string | null;
  @ApiProperty() createdAt!: string;
  @ApiProperty() updatedAt!: string;
  @ApiProperty() isOverdue!: boolean;
  @ApiProperty() reminderCount!: number;
}
