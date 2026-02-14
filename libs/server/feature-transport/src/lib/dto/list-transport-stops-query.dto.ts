import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListTransportStopsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeId?: string;

  @ApiPropertyOptional({ description: 'Search by stop name' })
  @IsOptional()
  @IsString()
  search?: string;
}
