import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class UpdateTimetableEntryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subjectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ minimum: 1, maximum: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek?: number;

  @ApiPropertyOptional({ example: '08:30' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'startTime must be HH:mm or HH:mm:ss',
  })
  startTime?: string;

  @ApiPropertyOptional({ example: '09:15' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'endTime must be HH:mm or HH:mm:ss',
  })
  endTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;
}
