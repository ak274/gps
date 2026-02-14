import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { ListStudentsResponseDto } from './dto/list-students-response.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { StudentsService } from './students.service';

@ApiTags('students')
@ApiBearerAuth()
@Scopes('students.read')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'List students in the authenticated tenant' })
  @ApiOkResponse({ type: ListStudentsResponseDto })
  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListStudentsQueryDto,
  ) {
    return this.studentsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get student by ID in the authenticated tenant' })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Get(':studentId')
  findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('studentId') studentId: string,
  ) {
    return this.studentsService.findById(user, studentId);
  }
}
