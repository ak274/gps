import { ApiProperty } from '@nestjs/swagger';

export class PlatformSchoolResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  tenantCode!: string;

  @ApiProperty()
  tenantName!: string;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  board!: string | null;

  @ApiProperty()
  campusCount!: number;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;
}
