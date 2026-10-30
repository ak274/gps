import { AdmissionFormStatus } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListAdmissionFormsQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() schoolId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() academicYearId?: string;
  @ApiPropertyOptional({ enum: AdmissionFormStatus }) @IsOptional() @IsEnum(AdmissionFormStatus) status?: AdmissionFormStatus;
}

