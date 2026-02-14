import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SchoolResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  board!: string | null;

  @ApiPropertyOptional()
  contactEmail!: string | null;

  @ApiPropertyOptional()
  contactPhone!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
