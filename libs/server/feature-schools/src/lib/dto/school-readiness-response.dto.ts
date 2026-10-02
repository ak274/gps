import { ApiProperty } from '@nestjs/swagger';

export class SchoolReadinessStepDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  label!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  complete!: boolean;

  @ApiProperty()
  required!: boolean;

  @ApiProperty()
  count!: number;

  @ApiProperty()
  href!: string;
}

export class SchoolReadinessResponseDto {
  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  schoolName!: string;

  @ApiProperty()
  percent!: number;

  @ApiProperty({ enum: ['NOT_STARTED', 'IN_PROGRESS', 'READY'] })
  status!: 'NOT_STARTED' | 'IN_PROGRESS' | 'READY';

  @ApiProperty({ type: [SchoolReadinessStepDto] })
  steps!: SchoolReadinessStepDto[];
}
