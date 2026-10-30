import { AdmissionFieldType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateAdmissionFormFieldDto {
  @ApiProperty() @IsString() key!: string;
  @ApiProperty() @IsString() label!: string;
  @ApiProperty({ enum: AdmissionFieldType }) @IsEnum(AdmissionFieldType) type!: AdmissionFieldType;
  @ApiPropertyOptional() @IsOptional() @IsString() helpText?: string;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() isRequired?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() isSensitive?: boolean;
  @ApiPropertyOptional({ default: 0 }) @IsOptional() @IsInt() @Min(0) sortOrder?: number;
  @ApiPropertyOptional({ type: Object }) @IsOptional() @IsObject() options?: Record<string, unknown>;
  @ApiPropertyOptional({ type: Object }) @IsOptional() @IsObject() visibility?: Record<string, unknown>;
  @ApiPropertyOptional({ type: Object }) @IsOptional() @IsObject() validation?: Record<string, unknown>;
}

