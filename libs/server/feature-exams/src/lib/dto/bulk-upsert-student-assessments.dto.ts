import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class UpsertStudentAssessmentRecordDto {
  @ApiProperty()
  @IsString()
  examSubjectId!: string;

  @ApiProperty()
  @IsString()
  studentId!: string;

  @ApiPropertyOptional({ example: '87.50' })
  @IsOptional()
  @IsNumberString()
  marksObtained?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 20)
  grade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  remarks?: string;
}

export class BulkUpsertStudentAssessmentsDto {
  @ApiProperty({ type: [UpsertStudentAssessmentRecordDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpsertStudentAssessmentRecordDto)
  records!: UpsertStudentAssessmentRecordDto[];
}

