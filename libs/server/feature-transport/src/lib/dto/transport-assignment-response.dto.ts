import { TransportAssignmentStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransportAssignmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  routeId!: string;

  @ApiProperty()
  stopId!: string;

  @ApiProperty()
  academicYearId!: string;

  @ApiProperty({ enum: TransportAssignmentStatus })
  status!: TransportAssignmentStatus;

  @ApiProperty({ description: 'ISO date string' })
  startsOn!: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  endsOn!: string | null;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
