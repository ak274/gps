import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AssignSchoolAdminDto {
  @ApiProperty({ description: 'Tenant membership id to be assigned' })
  @IsString()
  userTenantId!: string;

  @ApiProperty({ description: 'School id to be managed' })
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional({
    description: 'Whether assigned admin can manage all campuses under this school',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  canManageAllCampuses?: boolean;
}
