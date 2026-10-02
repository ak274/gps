import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GenerateInvoicesDto {
  @ApiProperty() @IsString() scheduleId!: string;
  @ApiProperty({ format: 'date' }) @IsDateString() periodStart!: string;
  @ApiProperty({ format: 'date' }) @IsDateString() periodEnd!: string;
  @ApiPropertyOptional({ format: 'date' }) @IsOptional() @IsDateString() issueDate?: string;
  @ApiPropertyOptional({ format: 'date' }) @IsOptional() @IsDateString() dueDate?: string;
}
