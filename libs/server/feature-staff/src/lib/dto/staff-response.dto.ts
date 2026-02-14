import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StaffResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiPropertyOptional()
  campusId!: string | null;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  employeeCode!: string;

  @ApiPropertyOptional()
  designation!: string | null;

  @ApiPropertyOptional()
  employmentType!: string | null;

  @ApiPropertyOptional()
  joinedOn!: string | null;

  @ApiPropertyOptional()
  profilePhotoKey!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
