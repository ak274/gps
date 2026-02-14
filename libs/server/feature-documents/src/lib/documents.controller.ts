import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Create document metadata record after successful object upload' })
  @ApiOkResponse({ type: DocumentResponseDto })
  @Scopes('documents.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.create(user, dto);
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
