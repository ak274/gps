import { TenantStatus } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';

export class TenantResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: TenantStatus })
  status!: TenantStatus;

  @ApiProperty()
  timeZone!: string;

  @ApiProperty()
  countryCode!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
