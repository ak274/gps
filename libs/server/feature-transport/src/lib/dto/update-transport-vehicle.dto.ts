import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateTransportVehicleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 40)
  vehicleType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  gpsDeviceId?: string;
}
