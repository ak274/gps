import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentResponseDto } from './dto/document-response.dto';
import { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import { ReviewDocumentDto } from './dto/review-document.dto';
import { RunExpiryRemindersDto } from './dto/run-expiry-reminders.dto';
import { DocumentsService } from './documents.service';

@ApiTags('documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiOperation({ summary: 'List document metadata in authenticated tenant' })
  @ApiOkResponse({ type: [DocumentResponseDto] })
  @Scopes('documents.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListDocumentsQueryDto) {
    return this.documentsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get document metadata by id' })
  @ApiOkResponse({ type: DocumentResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @Scopes('documents.read')
  @Get(':documentId')
  findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('documentId') documentId: string,
  ) {
    return this.documentsService.findById(user, documentId);
  }

  @ApiOperation({ summary: 'List audit history for a document' })
  @ApiOkResponse({ type: [Object] })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @Scopes('documents.read')
  @Get(':documentId/audit')
  audit(@CurrentUser() user: AuthenticatedUser, @Param('documentId') documentId: string) {
    return this.documentsService.audit(user, documentId);
  }

  @ApiOperation({ summary: 'Create document metadata record after successful object upload' })
  @ApiOkResponse({ type: DocumentResponseDto })
  @Scopes('documents.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Mark expired documents and create renewal tasks for upcoming expiries' })
  @ApiOkResponse({ schema: { type: 'object', properties: { expired: { type: 'number' }, tasksCreated: { type: 'number' } } } })
  @Scopes('documents.review')
  @Post('expiry-reminders/run')
  runExpiryReminders(@CurrentUser() user: AuthenticatedUser, @Query() dto: RunExpiryRemindersDto) {
    return this.documentsService.runExpiryReminders(user, dto);
  }

  @ApiOperation({ summary: 'Review document verification status' })
  @ApiOkResponse({ type: DocumentResponseDto })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @Scopes('documents.review')
  @Patch(':documentId/review')
  review(
    @CurrentUser() user: AuthenticatedUser,
    @Param('documentId') documentId: string,
    @Body() dto: ReviewDocumentDto,
  ) {
    return this.documentsService.review(user, documentId, dto);
  }

  @ApiOperation({ summary: 'Soft delete document metadata record' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean', example: true } },
    },
  })
  @ApiNotFoundResponse({ description: 'Document not found' })
  @Scopes('documents.write')
  @Delete(':documentId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('documentId') documentId: string) {
    return this.documentsService.remove(user, documentId);
  }
}
