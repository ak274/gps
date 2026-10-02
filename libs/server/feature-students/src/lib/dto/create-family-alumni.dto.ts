import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateFamilyAlumniDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 160)
  name!: string;

  @ApiPropertyOptional({ example: 'Parent' })
  @IsOptional()
  @IsString()
  relationshipLabel?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  admissionNo?: string;

  @ApiPropertyOptional({ example: '2008' })
  @IsOptional()
  @IsString()
  graduationYear?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
