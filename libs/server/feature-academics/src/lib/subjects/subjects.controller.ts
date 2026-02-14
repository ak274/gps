import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { ListSubjectsQueryDto } from './dto/list-subjects-query.dto';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectsService } from './subjects.service';

@ApiTags('subjects')
@ApiBearerAuth()
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @ApiOperation({ summary: 'List subjects in authenticated tenant' })
  @ApiOkResponse({ type: [SubjectResponseDto] })
  @Scopes('subjects.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListSubjectsQueryDto) {
    return this.subjectsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get subject by id in authenticated tenant' })
  @ApiOkResponse({ type: SubjectResponseDto })
  @ApiNotFoundResponse({ description: 'Subject not found' })
  @Scopes('subjects.read')
  @Get(':subjectId')
  findById(@CurrentUser() user: AuthenticatedUser, @Param('subjectId') subjectId: string) {
    return this.subjectsService.findById(user, subjectId);
  }

  @ApiOperation({ summary: 'Create subject in authenticated tenant' })
  @ApiOkResponse({ type: SubjectResponseDto })
  @ApiConflictResponse({ description: 'Duplicate subject code for school' })
  @Scopes('subjects.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update subject in authenticated tenant' })
  @ApiOkResponse({ type: SubjectResponseDto })
  @ApiNotFoundResponse({ description: 'Subject not found' })
  @Scopes('subjects.write')
  @Patch(':subjectId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('subjectId') subjectId: string,
    @Body() dto: UpdateSubjectDto,
  ) {
    return this.subjectsService.update(user, subjectId, dto);
  }
}
