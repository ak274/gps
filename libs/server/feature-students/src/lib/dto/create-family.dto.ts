import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({ example: 'Sharma Family' })
  @IsString()
  @Length(2, 160)
  displayName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
