import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListTimetableEntriesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classRoomId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 7 })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number;
}
