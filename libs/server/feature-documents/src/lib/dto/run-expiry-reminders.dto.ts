import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class RunExpiryRemindersDto {
  @ApiPropertyOptional({ default: 30, description: 'Create renewal tasks for documents expiring within this many days' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(365)
  days = 30;
}
