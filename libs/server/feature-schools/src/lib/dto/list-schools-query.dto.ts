import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListSchoolsQueryDto {
  @ApiPropertyOptional({ description: 'Search by school code/name' })
  @IsOptional()
  @IsString()
  search?: string;
}
