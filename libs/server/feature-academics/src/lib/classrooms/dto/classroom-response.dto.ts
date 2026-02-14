import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassroomResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiPropertyOptional()
  campusId!: string | null;

  @ApiProperty()
  academicYearId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  gradeLevel!: string;

  @ApiPropertyOptional()
  section!: string | null;

  @ApiPropertyOptional()
  capacity!: number | null;

  @ApiPropertyOptional()
  homeRoomTeacherId!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
