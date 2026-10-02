import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassroomSubjectResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  classRoomId!: string;

  @ApiProperty()
  className!: string;

  @ApiProperty()
  section!: string | null;

  @ApiProperty()
  subjectId!: string;

  @ApiProperty()
  subjectCode!: string;

  @ApiProperty()
  subjectName!: string;

  @ApiPropertyOptional()
  teacherId!: string | null;

  @ApiPropertyOptional()
  teacherName!: string | null;
}
