import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FamilyResponseDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  displayName!: string;
  @ApiPropertyOptional()
  notes!: string | null;
  @ApiProperty({ type: [Object] })
  students!: Array<Record<string, unknown>>;
  @ApiProperty({ type: [Object] })
  guardians!: Array<Record<string, unknown>>;
  @ApiProperty({ type: [Object] })
  alumni!: Array<Record<string, unknown>>;
  @ApiProperty({ type: [Object] })
  benefits!: Array<Record<string, unknown>>;
}
