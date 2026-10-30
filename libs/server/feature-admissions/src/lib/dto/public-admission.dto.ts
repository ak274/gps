import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString, IsEmail, Length, Min } from 'class-validator';

export class StartPublicAdmissionDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  formId?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 80)
  firstName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 80)
  lastName?: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @Length(7, 30)
  phone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classRoomId?: string;
}

export class VerifyPublicAdmissionDto {
  @ApiProperty()
  @IsString()
  @Length(6, 6)
  code!: string;
}

export class SavePublicAdmissionDraftDto {
  @ApiProperty({ type: Object })
  @IsObject()
  draftData!: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  currentSection?: number;
}
