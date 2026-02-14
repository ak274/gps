import { ApiProperty } from '@nestjs/swagger';

export class ClassWithSectionsResponseDto {
  @ApiProperty()
  schoolId!: string;

  @ApiProperty()
  academicYearId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  gradeLevel!: string;

  @ApiProperty({ type: [String] })
  sections!: string[];

  @ApiProperty({ type: [String] })
  classroomIds!: string[];
}
