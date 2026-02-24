import { ExamStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { ExamSubjectInputDto } from './exam-subject-input.dto';

export class CreateExamDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  termId?: string;

  @ApiProperty()
  @IsString()
  classRoomId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ description: 'Unique code per school' })
  @IsString()
  @Length(2, 50)
  code!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ description: 'e.g. Unit Test, Mid Term, Final' })
  @IsString()
  @Length(2, 60)
  examType!: string;

  @ApiProperty({ description: 'ISO date string' })
  @IsDateString()
  startsOn!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @IsDateString()
  endsOn?: string;

  @ApiPropertyOptional({ enum: ExamStatus, default: ExamStatus.DRAFT })
  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;

  @ApiPropertyOptional({ type: [ExamSubjectInputDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExamSubjectInputDto)
  subjects?: ExamSubjectInputDto[];
}

