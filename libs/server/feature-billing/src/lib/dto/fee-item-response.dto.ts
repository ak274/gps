import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FeeItemMetaResponseDto } from './fee-item-meta-response.dto';

export class FeeItemResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ example: '25000.00' })
  amount!: string;

  @ApiPropertyOptional({ type: FeeItemMetaResponseDto })
  meta?: FeeItemMetaResponseDto;
}
