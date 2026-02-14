import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GuardianResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiPropertyOptional()
  userId!: string | null;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional()
  lastName!: string | null;

  @ApiPropertyOptional()
  phoneE164!: string | null;

  @ApiPropertyOptional()
  email!: string | null;

  @ApiPropertyOptional()
  occupation!: string | null;

  @ApiPropertyOptional()
  relationNote!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
