import { ApiProperty } from '@nestjs/swagger';

export class TransportStopResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  routeId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  sequenceNo!: number;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
