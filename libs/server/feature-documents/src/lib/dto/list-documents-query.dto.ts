import { DocumentEntityType, DocumentReviewStatus } from '@gps/data-access-prisma';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListDocumentsQueryDto {
  @ApiPropertyOptional({ enum: DocumentReviewStatus })
  @IsEnum(DocumentReviewStatus)
  @IsOptional()
  reviewStatus?: DocumentReviewStatus;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  schoolId?: string;
  @ApiPropertyOptional({ enum: DocumentEntityType })
  @IsOptional()
  @IsEnum(DocumentEntityType)
  entityType?: DocumentEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by uploader user id' })
  @IsOptional()
  @IsString()
  uploadedById?: string;

  @ApiPropertyOptional({ description: 'Search in file name or storage key' })
  @IsOptional()
  @IsString()
  search?: string;
}
