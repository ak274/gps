import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSchoolDto {
  @ApiPropertyOptional({ example: 'Greenfield Public School - Central Campus' })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;

  @ApiPropertyOptional({ example: 'CBSE' })
  @IsOptional()
  @IsString()
  @Length(2, 40)
  board?: string;

  @ApiPropertyOptional({ example: 'admin@greenfield.edu' })
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
