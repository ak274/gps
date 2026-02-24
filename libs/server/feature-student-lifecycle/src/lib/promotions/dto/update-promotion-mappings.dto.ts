import { PromotionAction } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PromotionMappingInputDto {
  @ApiProperty()
  @IsString()
  fromClassRoomId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  toClassRoomId?: string;

  @ApiProperty({ enum: PromotionAction })
  @IsEnum(PromotionAction)
  action!: PromotionAction;
}

export class UpdatePromotionMappingsDto {
  @ApiProperty({ type: [PromotionMappingInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionMappingInputDto)
  mappings!: PromotionMappingInputDto[];
}

