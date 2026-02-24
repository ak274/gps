import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RejectExitRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  decisionNotes?: string;
}

