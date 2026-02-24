import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamResponseDto } from './dto/exam-response.dto';
import { ListExamsQueryDto } from './dto/list-exams-query.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamsService } from './exams.service';
import { ListStudentAssessmentsQueryDto } from './dto/list-student-assessments-query.dto';
import { StudentAssessmentResponseDto } from './dto/student-assessment-response.dto';
import { BulkUpsertStudentAssessmentsDto } from './dto/bulk-upsert-student-assessments.dto';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({ summary: 'List exams in authenticated tenant' })
  @ApiOkResponse({ type: [ExamResponseDto] })
  @Scopes('exams.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListExamsQueryDto) {
    return this.examsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get exam by id in authenticated tenant' })
  @ApiOkResponse({ type: ExamResponseDto })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.read')
  @Get(':examId')
  findById(@CurrentUser() user: AuthenticatedUser, @Param('examId') examId: string) {
    return this.examsService.findById(user, examId);
  }

  @ApiOperation({ summary: 'Create exam in authenticated tenant' })
  @ApiOkResponse({ type: ExamResponseDto })
  @ApiConflictResponse({ description: 'Duplicate exam code for school' })
  @Scopes('exams.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateExamDto) {
    return this.examsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update exam in authenticated tenant' })
  @ApiOkResponse({ type: ExamResponseDto })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @ApiConflictResponse({ description: 'Duplicate exam code for school' })
  @Scopes('exams.write')
  @Patch(':examId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('examId') examId: string,
    @Body() dto: UpdateExamDto,
  ) {
    return this.examsService.update(user, examId, dto);
  }

  @ApiOperation({ summary: 'Soft-delete exam in authenticated tenant' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.write')
  @Delete(':examId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('examId') examId: string) {
    return this.examsService.remove(user, examId);
  }

  @ApiOperation({ summary: 'Publish exam (DRAFT -> PUBLISHED)' })
  @ApiOkResponse({ type: ExamResponseDto })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.write')
  @Post(':examId/publish')
  publish(@CurrentUser() user: AuthenticatedUser, @Param('examId') examId: string) {
    return this.examsService.publishExam(user, examId);
  }

  @ApiOperation({ summary: 'Complete exam (PUBLISHED -> COMPLETED)' })
  @ApiOkResponse({ type: ExamResponseDto })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.write')
  @Post(':examId/complete')
  complete(@CurrentUser() user: AuthenticatedUser, @Param('examId') examId: string) {
    return this.examsService.completeExam(user, examId);
  }

  @ApiOperation({ summary: 'List student assessments (marks) for an exam' })
  @ApiOkResponse({ type: [StudentAssessmentResponseDto] })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.read')
  @Get(':examId/assessments')
  listAssessments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('examId') examId: string,
    @Query() query: ListStudentAssessmentsQueryDto,
  ) {
    return this.examsService.listAssessments(user, examId, query);
  }

  @ApiOperation({ summary: 'Bulk upsert student assessments (marks) for an exam' })
  @ApiOkResponse({ type: [StudentAssessmentResponseDto] })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.write')
  @Post(':examId/assessments:bulk-upsert')
  bulkUpsertAssessments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('examId') examId: string,
    @Body() dto: BulkUpsertStudentAssessmentsDto,
  ) {
    return this.examsService.bulkUpsertAssessments(user, examId, dto);
  }

  @ApiOperation({ summary: 'Publish all assessments for an exam (sets publishedAt)' })
  @ApiOkResponse({ schema: { example: { success: true, publishedCount: 123 } } })
  @ApiNotFoundResponse({ description: 'Exam not found' })
  @Scopes('exams.write')
  @Post(':examId/assessments:publish')
  publishAssessments(@CurrentUser() user: AuthenticatedUser, @Param('examId') examId: string) {
    return this.examsService.publishAssessments(user, examId);
  }
}
