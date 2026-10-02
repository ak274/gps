import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ProvisionSchoolDto } from './provision-school.dto';

export class PlatformProvisionSchoolDto extends ProvisionSchoolDto {
  @ApiProperty({ description: 'Institution/tenant that will own the new school' })
  @IsString()
  tenantId!: string;
}
