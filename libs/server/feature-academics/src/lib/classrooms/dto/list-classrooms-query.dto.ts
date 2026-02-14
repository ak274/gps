import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListClassroomsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Search by classroom name/grade/section' })
  @IsOptional()
  @IsString()
  search?: string;
}
