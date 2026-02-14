import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumberString, IsOptional, IsString, Length, Min } from 'class-validator';

export class InvoiceLineInputDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feeItemId?: string;

  @ApiProperty()
  @IsString()
  @Length(2, 180)
  description!: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiProperty({ example: '1200.00' })
  @IsNumberString()
  unitAmount!: string;
}
