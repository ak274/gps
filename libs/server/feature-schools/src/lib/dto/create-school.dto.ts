import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({ example: 'MAIN' })
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @IsString()
  @Length(2, 20)
  code!: string;

  @ApiProperty({ example: 'Greenfield Public School' })
  @Transform(({ value }) => String(value).trim())
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional({ example: 'CBSE' })
  @IsOptional()
  @IsString()
  @Length(2, 40)
  board?: string;

  @ApiPropertyOptional({ example: 'office@greenfield.edu' })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+919876543210' })
  @IsOptional()
  @IsString()
  @Length(6, 32)
  contactPhone?: string;
}
