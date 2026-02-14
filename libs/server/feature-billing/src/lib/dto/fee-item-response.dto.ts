import { ApiProperty } from '@nestjs/swagger';

export class FeeItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: '25000.00' })
  amount!: string;
}
