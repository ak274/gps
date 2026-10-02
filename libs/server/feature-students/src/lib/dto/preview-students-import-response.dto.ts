import { ApiProperty } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';
import { BulkImportStudentErrorDto } from './bulk-import-students-response.dto';

export class PreviewStudentsImportResponseDto {
  @ApiProperty()
  totalRows!: number;

  @ApiProperty()
  validRows!: number;

  @ApiProperty()
  invalidRows!: number;

  @ApiProperty({ type: [CreateStudentDto] })
  records!: CreateStudentDto[];

  @ApiProperty({ type: [BulkImportStudentErrorDto] })
  errors!: BulkImportStudentErrorDto[];
}
