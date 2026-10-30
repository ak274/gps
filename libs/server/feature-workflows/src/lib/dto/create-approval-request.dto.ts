import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateApprovalRequestDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiProperty({ minLength: 2, maxLength: 180 })
  @IsString()
  @Length(2, 180)
  title!: string;

  @ApiPropertyOptional({ maxLength: 4000 })
  @IsOptional()
  @IsString()
  @Length(0, 4000)
  description?: string;

  @ApiProperty({ description: 'Source record type, for example ADMISSION_APPLICATION or FEE_ADJUSTMENT' })
  @IsString()
  entityType!: string;

  @ApiProperty()
  @IsString()
  entityId!: string;

  @ApiProperty({ type: [String], description: 'Ordered approver user ids' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  approverIds!: string[];

  @ApiPropertyOptional({ format: 'date-time' })
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
