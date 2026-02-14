import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListTransportRoutesQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional({ description: 'Search by route code/name' })
  @IsOptional()
  @IsString()
  search?: string;
}
