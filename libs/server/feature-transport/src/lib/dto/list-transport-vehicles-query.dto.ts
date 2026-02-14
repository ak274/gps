import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListTransportVehiclesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Search by vehicle number/type' })
  @IsOptional()
  @IsString()
  search?: string;
}
