import { AdmissionDocumentReviewStatus, AdmissionStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, Length, Min } from 'class-validator';

export class TransitionAdmissionApplicationDto {
  @ApiProperty({ enum: AdmissionStatus })
  @IsEnum(AdmissionStatus)
  status!: AdmissionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 4000)
  message?: string;

  @ApiPropertyOptional({ description: 'Offer expiry date when issuing an offer' })
  @IsOptional()
  @IsDateString()
  offerExpiresAt?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class RecordAdmissionDocumentDto {
  @ApiProperty()
  @IsString()
  requirementKey!: string;

  @ApiProperty()
  @IsString()
  label!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storageKey?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSizeBytes?: number;
}

export class ReviewAdmissionDocumentDto {
  @ApiProperty({ enum: AdmissionDocumentReviewStatus })
  @IsEnum(AdmissionDocumentReviewStatus)
  reviewStatus!: AdmissionDocumentReviewStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  reviewNote?: string;
}
