import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { FeeItemInputDto } from './fee-item-input.dto';

export class CreateFeePlanDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional({ default: 'INR' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currencyCode?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [FeeItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FeeItemInputDto)
  items!: FeeItemInputDto[];
}
