import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceLineResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional()
  feeItemId!: string | null;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  quantity!: number;

  @ApiProperty({ example: '1200.00' })
  unitAmount!: string;

  @ApiProperty({ example: '2400.00' })
  lineTotal!: string;
}
