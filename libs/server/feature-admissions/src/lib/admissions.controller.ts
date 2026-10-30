import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Public, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { AdmissionsService } from './admissions.service';
import { CreateAdmissionApplicationDto } from './dto/create-admission-application.dto';
import { EnrollAdmissionApplicationDto } from './dto/enroll-admission-application.dto';
import { AdmissionApplicationResponseDto } from './dto/admission-application-response.dto';
import { ListAdmissionApplicationsQueryDto } from './dto/list-admission-applications-query.dto';
import { UpdateAdmissionApplicationDto } from './dto/update-admission-application.dto';
import { CreateAdmissionFormDto } from './dto/create-admission-form.dto';
import { CreateAdmissionFormSectionDto } from './dto/create-admission-form-section.dto';
import { CreateAdmissionFormFieldDto } from './dto/create-admission-form-field.dto';
import { CreateAdmissionDocumentRequirementDto } from './dto/create-admission-document-requirement.dto';
import { AdmissionFormResponseDto } from './dto/admission-form-response.dto';
import { ListAdmissionFormsQueryDto } from './dto/list-admission-forms-query.dto';
import { SavePublicAdmissionDraftDto, StartPublicAdmissionDto, VerifyPublicAdmissionDto } from './dto/public-admission.dto';
import { RecordAdmissionDocumentDto, ReviewAdmissionDocumentDto, TransitionAdmissionApplicationDto } from './dto/admission-workflow.dto';

@ApiTags('admissions')
@ApiBearerAuth()
@Controller('admissions')
export class AdmissionsController {
  constructor(private readonly admissionsService: AdmissionsService) {}

  @Public()
  @ApiOperation({ summary: 'Get the published public admission form for a school' })
  @Get('public/form/:schoolId')
  getPublicForm(@Param('schoolId') schoolId: string, @Query('formId') formId?: string) {
    return this.admissionsService.getPublicForm(schoolId, formId);
  }

  @Public()
  @ApiOperation({ summary: 'Start a resumable public admission session' })
  @Post('public/start')
  startPublicLead(@Body() dto: StartPublicAdmissionDto) {
    return this.admissionsService.startPublicLead(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Verify a parent email code for a public admission session' })
  @Post('public/:leadId/verify')
  verifyPublicLead(@Param('leadId') leadId: string, @Body() dto: VerifyPublicAdmissionDto) {
    return this.admissionsService.verifyPublicLead(leadId, dto);
  }

  @Public()
  @ApiOperation({ summary: 'Resume a verified public admission session' })
  @Get('public/:leadId')
  getPublicLead(@Param('leadId') leadId: string, @Query('resumeToken') resumeToken: string) {
    return this.admissionsService.getPublicLead(leadId, resumeToken);
  }

  @Public()
  @ApiOperation({ summary: 'Autosave a public admission draft' })
  @Patch('public/:leadId/draft')
  savePublicLead(@Param('leadId') leadId: string, @Query('resumeToken') resumeToken: string, @Body() dto: SavePublicAdmissionDraftDto) {
    return this.admissionsService.savePublicLead(leadId, resumeToken, dto);
  }

  @Public()
  @ApiOperation({ summary: 'Submit a verified public admission session' })
  @Post('public/:leadId/submit')
  submitPublicLead(@Param('leadId') leadId: string, @Query('resumeToken') resumeToken: string) {
    return this.admissionsService.submitPublicLead(leadId, resumeToken);
  }

  @ApiOperation({ summary: 'List configurable admission forms' })
  @ApiOkResponse({ type: [AdmissionFormResponseDto] })
  @Scopes('admissions.read')
  @Get('forms')
  listForms(@CurrentUser() user: AuthenticatedUser, @Query() query: ListAdmissionFormsQueryDto) {
    return this.admissionsService.listForms(user, query);
  }

  @ApiOperation({ summary: 'Create a draft admission form version' })
  @ApiOkResponse({ type: AdmissionFormResponseDto })
  @Scopes('admissions.write')
  @Post('forms')
  createForm(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateAdmissionFormDto) {
    return this.admissionsService.createForm(user, dto);
  }

  @ApiOperation({ summary: 'Add a section to a draft admission form' })
  @ApiOkResponse({ type: Object })
  @Scopes('admissions.write')
  @Post('forms/:formId/sections')
  addFormSection(@CurrentUser() user: AuthenticatedUser, @Param('formId') formId: string, @Body() dto: CreateAdmissionFormSectionDto) {
    return this.admissionsService.addFormSection(user, formId, dto);
  }

  @ApiOperation({ summary: 'Add a configurable field to a draft form section' })
  @ApiOkResponse({ type: Object })
  @Scopes('admissions.write')
  @Post('form-sections/:sectionId/fields')
  addFormField(@CurrentUser() user: AuthenticatedUser, @Param('sectionId') sectionId: string, @Body() dto: CreateAdmissionFormFieldDto) {
    return this.admissionsService.addFormField(user, sectionId, dto);
  }

  @ApiOperation({ summary: 'Add a document requirement to a draft admission form' })
  @ApiOkResponse({ type: Object })
  @Scopes('admissions.write')
  @Post('forms/:formId/documents')
  addDocumentRequirement(@CurrentUser() user: AuthenticatedUser, @Param('formId') formId: string, @Body() dto: CreateAdmissionDocumentRequirementDto) {
    return this.admissionsService.addDocumentRequirement(user, formId, dto);
  }

  @ApiOperation({ summary: 'Publish a form version and archive the previous version for the school/year' })
  @ApiOkResponse({ type: AdmissionFormResponseDto })
  @Scopes('admissions.write')
  @Post('forms/:formId/publish')
  publishForm(@CurrentUser() user: AuthenticatedUser, @Param('formId') formId: string) {
    return this.admissionsService.publishForm(user, formId);
  }

  @ApiOperation({ summary: 'Seed a draft with the standard Indian school admission baseline' })
  @ApiOkResponse({ type: AdmissionFormResponseDto })
  @Scopes('admissions.write')
  @Post('forms/:formId/seed-standard')
  seedStandardForm(@CurrentUser() user: AuthenticatedUser, @Param('formId') formId: string) {
    return this.admissionsService.seedStandardForm(user, formId);
  }

  @ApiOperation({ summary: 'List admission applications in authenticated tenant' })
  @ApiOkResponse({ type: [AdmissionApplicationResponseDto] })
  @Scopes('admissions.read')
  @Get('applications')
  listApplications(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListAdmissionApplicationsQueryDto,
  ) {
    return this.admissionsService.listApplications(user, query);
  }

  @ApiOperation({ summary: 'Get admission application by id in authenticated tenant' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @ApiNotFoundResponse({ description: 'Admission application not found' })
  @Scopes('admissions.read')
  @Get('applications/:applicationId')
  findApplicationById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
  ) {
    return this.admissionsService.findApplicationById(user, applicationId);
  }

  @ApiOperation({ summary: 'Move an admission application through its review, decision and enrollment-readiness workflow' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @Scopes('admissions.write')
  @Post('applications/:applicationId/transition')
  transitionApplication(@CurrentUser() user: AuthenticatedUser, @Param('applicationId') applicationId: string, @Body() dto: TransitionAdmissionApplicationDto) {
    return this.admissionsService.transitionApplication(user, applicationId, dto);
  }

  @ApiOperation({ summary: 'Get the audit timeline for an admission application' })
  @Scopes('admissions.read')
  @Get('applications/:applicationId/timeline')
  getApplicationTimeline(@CurrentUser() user: AuthenticatedUser, @Param('applicationId') applicationId: string) {
    return this.admissionsService.getApplicationTimeline(user, applicationId);
  }

  @ApiOperation({ summary: 'Record an uploaded admission document against its form requirement' })
  @Scopes('admissions.write')
  @Post('applications/:applicationId/documents')
  recordApplicationDocument(@CurrentUser() user: AuthenticatedUser, @Param('applicationId') applicationId: string, @Body() dto: RecordAdmissionDocumentDto) {
    return this.admissionsService.recordApplicationDocument(user, applicationId, dto);
  }

  @ApiOperation({ summary: 'Verify or reject an admission document' })
  @Scopes('admissions.write')
  @Patch('applications/:applicationId/documents/:documentId/review')
  reviewApplicationDocument(@CurrentUser() user: AuthenticatedUser, @Param('applicationId') applicationId: string, @Param('documentId') documentId: string, @Body() dto: ReviewAdmissionDocumentDto) {
    return this.admissionsService.reviewApplicationDocument(user, applicationId, documentId, dto);
  }

  @ApiOperation({ summary: 'Create admission application in authenticated tenant' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @Scopes('admissions.write')
  @Post('applications')
  createApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAdmissionApplicationDto,
  ) {
    return this.admissionsService.createApplication(user, dto);
  }

  @ApiOperation({ summary: 'Update admission application in authenticated tenant' })
  @ApiOkResponse({ type: AdmissionApplicationResponseDto })
  @ApiNotFoundResponse({ description: 'Admission application not found' })
  @Scopes('admissions.write')
  @Patch('applications/:applicationId')
  updateApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: UpdateAdmissionApplicationDto,
  ) {
    return this.admissionsService.updateApplication(user, applicationId, dto);
  }

  @ApiOperation({ summary: 'Enroll an admission application (creates student, guardians, and enrollment)' })
  @ApiOkResponse({ schema: { example: { success: true, studentId: '...' } } })
  @ApiNotFoundResponse({ description: 'Admission application not found' })
  @Scopes('admissions.write')
  @Post('applications/:applicationId/enroll')
  enroll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('applicationId') applicationId: string,
    @Body() dto: EnrollAdmissionApplicationDto,
  ) {
    return this.admissionsService.enroll(user, applicationId, dto);
  }
}

