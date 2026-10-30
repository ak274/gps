import { StudentDocumentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpsertStudentDocumentDto {
  @ApiProperty({ example: 'birthCertificate' })
  @IsString()
  @Length(2, 80)
  key!: string;

  @ApiProperty({ example: 'Birth certificate' })
  @IsString()
  @Length(2, 160)
  label!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(StudentDocumentStatus)
  status?: StudentDocumentStatus;

  @ApiPropertyOptional({ description: 'Existing metadata document id after object storage upload' })
  @IsOptional()
  @IsString()
  documentId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  reviewNote?: string | null;
}

export class UpdateStudentDocumentReviewDto {
  @ApiProperty({ enum: StudentDocumentStatus })
  @IsEnum(StudentDocumentStatus)
  status!: StudentDocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  reviewNote?: string | null;
}

export class UpsertStudentMedicalProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  allergies?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medicalConditions?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  medications?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dietaryRequirements?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  physicalRestrictions?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyInstructions?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyContactName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doctorName?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doctorPhone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  consentVersion?: string | null;
}
