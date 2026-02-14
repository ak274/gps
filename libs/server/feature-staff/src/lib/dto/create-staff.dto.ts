import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiProperty()
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsString()
  @Length(1, 80)
  employeeCode!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  designation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  employmentType?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  joinedOn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePhotoKey?: string;
}
