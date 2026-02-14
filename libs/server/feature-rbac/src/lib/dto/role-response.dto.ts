import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  key!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional()
  description!: string | null;

  @ApiProperty()
  isSystem!: boolean;

  @ApiProperty({ type: [String] })
  permissionKeys!: string[];

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
