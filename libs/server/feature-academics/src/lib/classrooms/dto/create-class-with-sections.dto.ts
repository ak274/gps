import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateClassWithSectionsDto {
  @ApiProperty()
  @IsString()
  schoolId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  campusId?: string;

  @ApiProperty()
  @IsString()
  academicYearId!: string;

  @ApiProperty({ description: 'Class name, e.g. Grade 8' })
  @IsString()
  @Length(2, 80)
  name!: string;

  @ApiProperty({ description: 'Grade level, e.g. 8' })
  @IsString()
  @Length(1, 40)
  gradeLevel!: string;

  @ApiProperty({ type: [String], description: 'Section names, e.g. [A, B, C]' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Length(1, 20, { each: true })
  sections!: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  homeRoomTeacherId?: string;
}
