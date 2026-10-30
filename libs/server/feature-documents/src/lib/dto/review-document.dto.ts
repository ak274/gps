import { DocumentReviewStatus } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class ReviewDocumentDto {
  @ApiProperty({ enum: DocumentReviewStatus })
  @IsEnum(DocumentReviewStatus)
  status!: DocumentReviewStatus;

  @ApiPropertyOptional({ description: 'Required for rejected or needs-information decisions' })
  @IsOptional()
  @IsString()
  @Length(2, 2000)
  note?: string;

  @ApiPropertyOptional({ description: 'ISO date when the verified document expires' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
