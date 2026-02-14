import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class LinkStudentGuardianDto {
  @ApiProperty({ description: 'Relation with student e.g. father/mother/guardian' })
  @IsString()
  @Length(1, 80)
  relationType!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
