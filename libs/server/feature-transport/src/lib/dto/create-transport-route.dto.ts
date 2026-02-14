import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTransportRouteDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 30)
  code!: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleId?: string;
}
