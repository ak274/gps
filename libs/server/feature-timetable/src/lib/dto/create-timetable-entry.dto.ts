import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class CreateTimetableEntryDto {
  @ApiProperty()
  @IsString()
  classRoomId!: string;

  @ApiProperty()
  @IsString()
  subjectId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ minimum: 1, maximum: 7 })
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek!: number;

  @ApiProperty({ example: '08:30' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'startTime must be HH:mm or HH:mm:ss',
  })
  startTime!: string;

  @ApiProperty({ example: '09:15' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/, {
    message: 'endTime must be HH:mm or HH:mm:ss',
  })
  endTime!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;
}
