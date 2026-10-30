import { TaskPriority, TaskStatus } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsOptional, IsString } from 'class-validator';

export class ListTasksQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({ description: 'Only tasks assigned to the authenticated user', default: 'false' })
  @IsOptional()
  @IsBooleanString()
  mineOnly?: string;

  @ApiPropertyOptional({ description: 'Only active tasks past their due date', default: 'false' })
  @IsOptional()
  @IsBooleanString()
  overdue?: string;
}
