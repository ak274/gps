import { AdmissionStatus, Gender } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsObject, IsOptional, IsString, Length } from 'class-validator';

export class CreateAdmissionApplicationDto {
  @ApiPropertyOptional({ description: 'Published admission form version used by this application' })
  @IsOptional()
  @IsString()
  formId?: string;

  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classRoomId?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 120)
  firstName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 120)
  lastName?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ description: 'ISO date string' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty()
  @IsString()
  @Length(1, 120)
  guardianFirstName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 120)
  guardianLastName?: string;

  @ApiPropertyOptional({ description: 'E.164 phone string' })
  @IsOptional()
  @IsString()
  guardianPhoneE164?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guardianEmail?: string;

  @ApiProperty({ description: 'Relationship to student (e.g. father, mother, guardian)' })
  @IsString()
  @Length(1, 60)
  relationType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  notes?: string;

  @ApiPropertyOptional({ enum: AdmissionStatus, description: 'Defaults to DRAFT' })
  @IsOptional()
  @IsEnum(AdmissionStatus)
  status?: AdmissionStatus;

  @ApiPropertyOptional({ type: Object, description: 'Answers to school-configured fields' })
  @IsOptional()
  @IsObject()
  formData?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  admissionCategory?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  applicationSource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  termsVersion?: string;
}

