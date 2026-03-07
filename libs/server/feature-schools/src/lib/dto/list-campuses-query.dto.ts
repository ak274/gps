import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListCampusesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by school id' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Search by campus code/name' })
  @IsOptional()
  @IsString()
  search?: string;
}
