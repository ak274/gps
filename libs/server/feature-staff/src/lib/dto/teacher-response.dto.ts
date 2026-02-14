import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  staffProfileId!: string;

  @ApiPropertyOptional()
  specialization!: string | null;

  @ApiPropertyOptional()
  experienceYears!: number | null;

  @ApiProperty()
  createdAt!: string;
}
