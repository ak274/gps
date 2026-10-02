import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeeAssignmentResponseDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  feePlanId!: string;
  @ApiProperty()
  feePlanName!: string;
  @ApiProperty()
  scope!: 'CLASS' | 'STUDENT';
  @ApiProperty()
  targetId!: string;
  @ApiPropertyOptional()
  targetLabel!: string | null;
}
