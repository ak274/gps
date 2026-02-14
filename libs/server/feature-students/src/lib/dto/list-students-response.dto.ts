import { ApiProperty } from '@nestjs/swagger';
import { StudentResponseDto } from './student-response.dto';

class StudentsPaginationDto {
  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;

  @ApiProperty()
  total!: number;
}

export class ListStudentsResponseDto {
  @ApiProperty({ type: [StudentResponseDto] })
  data!: StudentResponseDto[];

  @ApiProperty({ type: StudentsPaginationDto })
  pagination!: StudentsPaginationDto;
}
