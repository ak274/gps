import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class ExamSubjectInputDto {
  @ApiProperty()
  @IsString()
  subjectId!: string;

  @ApiProperty({ example: '100.00' })
  @IsNumberString()
  maxMarks!: string;

  @ApiPropertyOptional({ example: '33.00' })
  @IsOptional()
  @IsNumberString()
  passMarks?: string;

  @ApiPropertyOptional({ example: '1.00' })
  @IsOptional()
  @IsNumberString()
  weightage?: string;
}

