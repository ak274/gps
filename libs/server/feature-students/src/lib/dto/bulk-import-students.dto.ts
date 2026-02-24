import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateStudentDto } from './create-student.dto';

export class BulkImportStudentsDto {
  @ApiProperty({ type: [CreateStudentDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  records!: CreateStudentDto[];
}

