import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { ClassroomSubjectsService } from './classroom-subjects.service';
import { CreateClassroomSubjectDto } from './dto/create-classroom-subject.dto';
import { ClassroomSubjectResponseDto } from './dto/classroom-subject-response.dto';
import { ListClassroomSubjectsQueryDto } from './dto/list-classroom-subjects-query.dto';

@ApiTags('classroom-subjects')
@ApiBearerAuth()
@Controller('classroom-subjects')
export class ClassroomSubjectsController {
  constructor(private readonly classroomSubjectsService: ClassroomSubjectsService) {}

  @ApiOperation({ summary: 'List subjects and assigned teachers by classroom' })
  @ApiOkResponse({ type: [ClassroomSubjectResponseDto] })
  @Scopes('classrooms.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListClassroomSubjectsQueryDto) {
    return this.classroomSubjectsService.list(user, query);
  }

  @ApiOperation({ summary: 'Assign a subject and optional teacher to a classroom' })
  @ApiOkResponse({ type: [ClassroomSubjectResponseDto] })
  @Scopes('classrooms.write')
  @Post()
  assign(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateClassroomSubjectDto) {
    return this.classroomSubjectsService.assign(user, dto);
  }
}
