import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateSubjectDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty({ example: 'MATH' })
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @IsString()
  @Length(2, 30)
  code!: string;

  @ApiProperty({ example: 'Mathematics' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isOptional?: boolean;
}
