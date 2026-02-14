import { TransportAssignmentStatus } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListTransportAssignmentsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  routeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  academicYearId?: string;

  @ApiPropertyOptional({ enum: TransportAssignmentStatus })
  @IsOptional()
  @IsEnum(TransportAssignmentStatus)
  status?: TransportAssignmentStatus;
}
