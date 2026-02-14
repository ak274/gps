import { ApiProperty } from '@nestjs/swagger';

export class UserRoleAssignmentResponseDto {
  @ApiProperty()
  userTenantId!: string;

  @ApiProperty({ type: [String] })
  roleKeys!: string[];
}
