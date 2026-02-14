import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListClassSectionsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  academicYearId?: string;

  @ApiPropertyOptional({ description: 'Search by class name/grade/section' })
  @IsOptional()
  @IsString()
  search?: string;
}
