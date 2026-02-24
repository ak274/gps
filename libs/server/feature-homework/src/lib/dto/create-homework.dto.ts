import { HomeworkStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class CreateHomeworkDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  classRoomId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subjectId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty()
  @IsString()
  @Length(2, 200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 4000)
  description?: string;

  @ApiProperty({ description: 'ISO date string' })
  @IsDateString()
  assignedOn!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @IsDateString()
  dueOn?: string;

  @ApiPropertyOptional({ enum: HomeworkStatus, default: HomeworkStatus.DRAFT })
  @IsOptional()
  @IsEnum(HomeworkStatus)
  status?: HomeworkStatus;
}

