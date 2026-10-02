import { FamilyBenefitType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFamilyBenefitDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  feePlanId?: string;

  @ApiProperty({ enum: FamilyBenefitType })
  @IsEnum(FamilyBenefitType)
  type!: FamilyBenefitType;

  @ApiProperty({ example: '10.00' })
  @IsNumberString()
  value!: string;

  @ApiPropertyOptional({ default: 2 })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(20)
  minimumStudentCount?: number;

  @ApiProperty({ example: 'Second sibling discount' })
  @IsString()
  reason!: string;
}
