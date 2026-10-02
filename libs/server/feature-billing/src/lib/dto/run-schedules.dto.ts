import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RunSchedulesDto {
  @ApiProperty() @IsString() schoolId!: string;
  @ApiPropertyOptional({ format: 'date' }) @IsOptional() @IsDateString() asOf?: string;
}
