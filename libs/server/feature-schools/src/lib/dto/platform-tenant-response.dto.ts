import { ApiProperty } from '@nestjs/swagger';

export class PlatformTenantResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  schoolCount!: number;
}
