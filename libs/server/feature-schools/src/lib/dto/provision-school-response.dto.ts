import { ApiProperty } from '@nestjs/swagger';
import { CampusResponseDto } from './campus-response.dto';
import { SchoolResponseDto } from './school-response.dto';

export class ProvisionedSchoolAdminDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  userTenantId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string | null;

  @ApiProperty({ enum: ['INVITED', 'ACTIVE'] })
  status!: 'INVITED' | 'ACTIVE';

  @ApiProperty()
  roleKey!: string;
}

export class ProvisionSchoolResponseDto {
  @ApiProperty({ type: SchoolResponseDto })
  school!: SchoolResponseDto;

  @ApiProperty({ type: CampusResponseDto })
  campus!: CampusResponseDto;

  @ApiProperty({ type: ProvisionedSchoolAdminDto })
  schoolAdmin!: ProvisionedSchoolAdminDto;

  @ApiProperty({ enum: ['PROVISIONED', 'ADMIN_INVITED'] })
  status!: 'PROVISIONED' | 'ADMIN_INVITED';
}
