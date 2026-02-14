import { ApiProperty } from '@nestjs/swagger';

export class StudentGuardianLinkResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  guardianId!: string;

  @ApiProperty()
  relationType!: string;

  @ApiProperty()
  isPrimary!: boolean;

  @ApiProperty()
  createdAt!: string;
}
