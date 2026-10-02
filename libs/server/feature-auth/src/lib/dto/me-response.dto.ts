import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDto {
  @ApiProperty()
  sub!: string;

  @ApiProperty()
  sid!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  tenantId!: string;

  @ApiProperty()
  tenantCode!: string;

  @ApiProperty()
  isPlatformAdmin!: boolean;

  @ApiProperty({ type: [String] })
  roles!: string[];

  @ApiProperty({ type: [String] })
  scopes!: string[];
}
