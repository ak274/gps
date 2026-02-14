import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransportVehicleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  vehicleNumber!: string;

  @ApiPropertyOptional()
  vehicleType!: string | null;

  @ApiPropertyOptional()
  capacity!: number | null;

  @ApiPropertyOptional()
  gpsDeviceId!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
