import { DocumentEntityType } from '@gps/data-access-prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ enum: DocumentEntityType })
  @IsEnum(DocumentEntityType)
  entityType!: DocumentEntityType;

  @ApiProperty({ description: 'Target entity ID within tenant' })
  @IsString()
  entityId!: string;

  @ApiProperty({ example: 'PROFILE_PHOTO' })
  @IsString()
  @Length(2, 80)
  category!: string;

  @ApiProperty({ example: 'teacher-photo.jpg' })
  @IsString()
  @Length(1, 255)
  fileName!: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @Length(1, 120)
  mimeType!: string;

  @ApiProperty({ description: 'File size in bytes', example: 182331 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(Number.MAX_SAFE_INTEGER)
  fileSizeBytes!: number;

  @ApiPropertyOptional({ example: 'school-assets-prod' })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  storageBucket?: string;

  @ApiProperty({ example: 'tenants/t_1/students/s_1/photo.jpg' })
  @IsString()
  @Length(1, 512)
  storageKey!: string;

  @ApiPropertyOptional({ example: 'sha256:abc123...' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  checksum?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
