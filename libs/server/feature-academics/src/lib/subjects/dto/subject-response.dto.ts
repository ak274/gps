import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubjectResponseDto {
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
  isOptional!: boolean;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
