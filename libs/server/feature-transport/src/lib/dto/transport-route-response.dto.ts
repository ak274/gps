import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransportRouteResponseDto {
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
  vehicleId!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
