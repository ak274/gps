import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CampusResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  addressLine1!: string | null;

  @ApiPropertyOptional()
  addressLine2!: string | null;

  @ApiPropertyOptional()
  city!: string | null;

  @ApiPropertyOptional()
  state!: string | null;

  @ApiPropertyOptional()
  postalCode!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
