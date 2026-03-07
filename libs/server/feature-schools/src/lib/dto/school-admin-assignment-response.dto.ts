import { ApiProperty } from '@nestjs/swagger';

export class SchoolAdminAssignmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  userTenantId!: string;

  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  canManageAllCampuses!: boolean;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  userEmail!: string;

  @ApiProperty()
  schoolCode!: string;

  @ApiProperty()
  schoolName!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  createdAt!: string;

  @ApiProperty({ description: 'ISO datetime string' })
  updatedAt!: string;
}
