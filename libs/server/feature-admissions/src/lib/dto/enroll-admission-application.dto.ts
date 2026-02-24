import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class EnrollAdmissionApplicationDto {
  @ApiProperty({ description: 'Unique admission number per school' })
  @IsString()
  @Length(1, 60)
  admissionNo!: string;

  @ApiPropertyOptional({ description: 'If missing, uses application.classRoomId' })
  @IsOptional()
  @IsString()
  classRoomId?: string;

  @ApiPropertyOptional({ description: 'ISO date string' })
  @IsOptional()
  @IsDateString()
  joinedOn?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  createEnrollment?: boolean;
}

