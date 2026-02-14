import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class ReplaceUserTenantRolesDto {
  @ApiProperty({ type: [String], description: 'Role keys to assign to user membership' })
  @IsArray()
  @ArrayUnique()
  @Type(() => String)
  @IsString({ each: true })
  roleKeys!: string[];
}
