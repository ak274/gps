import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BulkImportStudentsCsvDto {
  @ApiProperty({ description: 'School id for all imported students' })
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional({ description: 'Optional campus id for all imported students' })
  @IsOptional()
  @IsString()
  campusId?: string;

  // `file` is handled by FileInterceptor and documented via @ApiBody in controller.
}

