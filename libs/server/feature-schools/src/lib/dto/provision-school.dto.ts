import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class ProvisionSchoolDto {
  @ApiProperty({ example: 'MAIN' })
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @IsString()
  @Length(2, 20)
  schoolCode!: string;

  @ApiProperty({ example: 'Greenfield Public School' })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(2, 120)
  schoolName!: string;

  @ApiPropertyOptional({ example: 'CBSE' })
  @IsOptional()
  @IsString()
  @Length(2, 40)
  board?: string;

  @ApiPropertyOptional({ example: 'office@greenfield.edu' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @Length(6, 32)
  contactPhone?: string;

  @ApiProperty({ example: 'MAIN' })
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @IsString()
  @Length(2, 20)
  campusCode!: string;

  @ApiProperty({ example: 'Main Campus' })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(2, 120)
  campusName!: string;

  @ApiProperty({ example: 'admin@greenfield.edu' })
  @Transform(({ value }) => String(value).trim().toLowerCase())
  @IsEmail()
  adminEmail!: string;

  @ApiProperty({ example: 'Aarav' })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(2, 80)
  adminFirstName!: string;

  @ApiPropertyOptional({ example: 'Sharma' })
  @IsOptional()
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(2, 80)
  adminLastName?: string;
}
