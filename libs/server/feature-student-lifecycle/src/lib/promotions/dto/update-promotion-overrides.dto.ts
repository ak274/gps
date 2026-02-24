import { PromotionDecision } from '@gps/data-access-prisma';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PromotionOverrideInputDto {
  @ApiProperty()
  @IsString()
  studentId!: string;

  @ApiProperty({ enum: PromotionDecision })
  @IsEnum(PromotionDecision)
  decision!: PromotionDecision;

  @ApiProperty({ required: false, description: 'Explicit target classRoomId for PROMOTE/DETAIN decisions (optional)' })
  @IsOptional()
  @IsString()
  toClassRoomId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdatePromotionOverridesDto {
  @ApiProperty({ type: [PromotionOverrideInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionOverrideInputDto)
  overrides!: PromotionOverrideInputDto[];
}

