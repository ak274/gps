import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListRolesQueryDto {
  @ApiPropertyOptional({ description: 'Search by role key or name' })
  @IsOptional()
  @IsString()
  search?: string;
}
