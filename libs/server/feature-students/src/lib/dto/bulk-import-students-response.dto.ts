import { ApiProperty } from '@nestjs/swagger';
import { StudentResponseDto } from './student-response.dto';

export class BulkImportStudentErrorDto {
  @ApiProperty()
  rowIndex!: number;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  details!: Record<string, unknown>;
}

export class BulkImportStudentsResponseDto {
  @ApiProperty()
  createdCount!: number;

  @ApiProperty()
  failedCount!: number;

  @ApiProperty({ type: [StudentResponseDto] })
  created!: StudentResponseDto[];

  @ApiProperty({ type: [BulkImportStudentErrorDto] })
  errors!: BulkImportStudentErrorDto[];
}

