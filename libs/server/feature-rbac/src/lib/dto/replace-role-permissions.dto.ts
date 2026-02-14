import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayUnique, IsArray, IsString } from 'class-validator';

export class ReplaceRolePermissionsDto {
  @ApiProperty({ type: [String], description: 'Permission keys to assign to role' })
  @IsArray()
  @ArrayUnique()
  @Type(() => String)
  @IsString({ each: true })
  permissionKeys!: string[];
}
