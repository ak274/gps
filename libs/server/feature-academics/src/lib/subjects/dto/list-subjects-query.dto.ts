import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListSubjectsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Search by subject code/name' })
  @IsOptional()
  @IsString()
  search?: string;
}
