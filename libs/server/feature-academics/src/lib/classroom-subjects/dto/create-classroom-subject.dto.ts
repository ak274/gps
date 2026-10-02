import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateClassroomSubjectDto {
  @ApiProperty()
  @IsString()
  classRoomId!: string;

  @ApiProperty()
  @IsString()
  subjectId!: string;

  @ApiPropertyOptional({ description: 'Teacher profile assigned to teach this subject in the class' })
  @IsOptional()
  @IsString()
  teacherId?: string;
}
