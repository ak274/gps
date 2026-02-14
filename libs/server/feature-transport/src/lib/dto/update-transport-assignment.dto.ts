import { TransportAssignmentStatus } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTransportAssignmentDto {
  @ApiPropertyOptional({ enum: TransportAssignmentStatus })
  @IsOptional()
  @IsEnum(TransportAssignmentStatus)
  status?: TransportAssignmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stopId?: string;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  endsOn?: string;
}
