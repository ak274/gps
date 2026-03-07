import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListAdminAssignmentsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by school id' })
  @IsOptional()
  @IsString()
  schoolId?: string;

  @ApiPropertyOptional({ description: 'Filter by tenant membership id' })
  @IsOptional()
  @IsString()
  userTenantId?: string;
}
