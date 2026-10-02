import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TeacherResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  staffProfileId!: string;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional()
  lastName!: string | null;

  @ApiPropertyOptional()
  specialization!: string | null;

  @ApiPropertyOptional()
  experienceYears!: number | null;

  @ApiProperty()
  createdAt!: string;
}
