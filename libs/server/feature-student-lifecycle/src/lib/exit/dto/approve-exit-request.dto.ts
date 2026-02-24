import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ApproveExitRequestDto {
  @ApiPropertyOptional({ description: 'Effective date for exit (YYYY-MM-DD). Defaults to request effective date or today.' })
  @IsOptional()
  @IsDateString()
  effectiveOn?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  decisionNotes?: string;
}

