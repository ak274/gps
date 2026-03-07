import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { FeeItemAttributeInputDto } from './fee-item-attribute-input.dto';
import { FeeItemDiscountInputDto } from './fee-item-discount-input.dto';

export class FeeItemInputDto {
  @ApiProperty({ example: 'TUITION' })
  @IsString()
  @Length(2, 30)
  code!: string;

  @ApiProperty({ example: 'Tuition Fee' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: '25000.00', required: false, description: 'Flat amount. Optional when attributes are provided.' })
  @IsOptional()
  @IsNumberString()
  amount?: string;

  @ApiProperty({ type: [FeeItemAttributeInputDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FeeItemAttributeInputDto)
  attributes?: FeeItemAttributeInputDto[];

  @ApiProperty({ type: FeeItemDiscountInputDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FeeItemDiscountInputDto)
  discount?: FeeItemDiscountInputDto;
}
