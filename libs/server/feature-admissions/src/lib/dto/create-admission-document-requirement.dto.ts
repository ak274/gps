import { AdmissionDocumentStage } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateAdmissionDocumentRequirementDto {
  @ApiProperty() @IsString() schoolId!: string;
  @ApiProperty() @IsString() key!: string;
  @ApiProperty() @IsString() label!: string;
  @ApiProperty({ enum: AdmissionDocumentStage }) @IsEnum(AdmissionDocumentStage) stage!: AdmissionDocumentStage;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() isRequired?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() isSensitive?: boolean;
  @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) acceptedTypes?: string[];
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxSizeMb?: number;
}

