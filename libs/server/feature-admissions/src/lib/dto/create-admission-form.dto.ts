import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateAdmissionFormDto {
  @ApiProperty() @IsString() schoolId!: string;
  @ApiProperty() @IsString() academicYearId!: string;
  @ApiProperty() @IsString() @Length(2, 160) name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() termsText?: string;
}

