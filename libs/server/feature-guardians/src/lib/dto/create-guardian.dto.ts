import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateGuardianDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 120)
  firstName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 120)
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(5, 30)
  phoneE164?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 150)
  occupation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 200)
  relationNote?: string;
}
