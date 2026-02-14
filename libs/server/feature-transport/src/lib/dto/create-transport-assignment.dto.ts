import { TransportAssignmentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTransportAssignmentDto {
  @ApiProperty()
  @IsString()
  studentId!: string;

  @ApiProperty()
  @IsString()
  routeId!: string;

  @ApiProperty()
  @IsString()
  stopId!: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiProperty({ format: 'date' })
  @IsDateString()
  startsOn!: string;

  @ApiPropertyOptional({ enum: TransportAssignmentStatus, default: TransportAssignmentStatus.ACTIVE })
  @IsOptional()
  @IsEnum(TransportAssignmentStatus)
  status?: TransportAssignmentStatus;

  @ApiPropertyOptional({ format: 'date' })
  @IsOptional()
  @IsDateString()
  endsOn?: string;
}
