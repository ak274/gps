import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { PromotionsService } from './promotions.service';
import { CreatePromotionBatchDto } from './dto/create-promotion-batch.dto';
import { PromotionBatchResponseDto } from './dto/promotion-batch-response.dto';
import { PromotionBatchPreviewResponseDto } from './dto/promotion-batch-preview-response.dto';
import { UpdatePromotionMappingsDto } from './dto/update-promotion-mappings.dto';
import { UpdatePromotionOverridesDto } from './dto/update-promotion-overrides.dto';
import { PromotionLetterResponseDto } from './dto/promotion-letters-response.dto';

@ApiTags('student-lifecycle')
@ApiBearerAuth()
@Controller('lifecycle')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @ApiOperation({ summary: 'Create a promotion batch (with optional auto mappings)' })
  @ApiOkResponse({ type: PromotionBatchResponseDto })
  @Scopes('students.lifecycle.write')
  @Post('promotion-batches')
  createBatch(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePromotionBatchDto) {
    return this.promotionsService.createBatch(user, dto);
  }

  @ApiOperation({ summary: 'List promotion batches in authenticated tenant' })
  @ApiOkResponse({ type: [PromotionBatchResponseDto] })
  @Scopes('students.lifecycle.read')
  @Get('promotion-batches')
  listBatches(@CurrentUser() user: AuthenticatedUser, @Query('schoolId') schoolId?: string) {
    return this.promotionsService.listBatches(user, schoolId);
  }

  @ApiOperation({ summary: 'Get promotion batch by id' })
  @ApiOkResponse({ type: PromotionBatchResponseDto })
  @ApiNotFoundResponse({ description: 'Promotion batch not found' })
  @Scopes('students.lifecycle.read')
  @Get('promotion-batches/:batchId')
  findBatchById(@CurrentUser() user: AuthenticatedUser, @Param('batchId') batchId: string) {
    return this.promotionsService.findBatchById(user, batchId);
  }

  @ApiOperation({ summary: 'Preview promotion decisions for a batch (eligibility + remarks)' })
  @ApiOkResponse({ type: PromotionBatchPreviewResponseDto })
  @ApiNotFoundResponse({ description: 'Promotion batch not found' })
  @Scopes('students.lifecycle.read')
  @Get('promotion-batches/:batchId/preview')
  preview(@CurrentUser() user: AuthenticatedUser, @Param('batchId') batchId: string) {
    return this.promotionsService.preview(user, batchId);
  }

  @ApiOperation({ summary: 'Generate promotion letters / academic history slips payload (JSON)' })
  @ApiOkResponse({ type: [PromotionLetterResponseDto] })
  @ApiNotFoundResponse({ description: 'Promotion batch not found' })
  @Scopes('students.lifecycle.read')
  @Get('promotion-batches/:batchId/letters')
  letters(@CurrentUser() user: AuthenticatedUser, @Param('batchId') batchId: string) {
    return this.promotionsService.letters(user, batchId);
  }

  @ApiOperation({ summary: 'Update class-to-class promotion mappings for a batch' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Promotion batch not found' })
  @Scopes('students.lifecycle.write')
  @Patch('promotion-batches/:batchId/mappings')
  updateMappings(
    @CurrentUser() user: AuthenticatedUser,
    @Param('batchId') batchId: string,
    @Body() dto: UpdatePromotionMappingsDto,
  ) {
    return this.promotionsService.updateMappings(user, batchId, dto);
  }

  @ApiOperation({ summary: 'Update per-student promotion overrides for a batch (detain/reassign/graduation/exit)' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Promotion batch not found' })
  @Scopes('students.lifecycle.write')
  @Patch('promotion-batches/:batchId/overrides')
  updateOverrides(
    @CurrentUser() user: AuthenticatedUser,
    @Param('batchId') batchId: string,
    @Body() dto: UpdatePromotionOverridesDto,
  ) {
    return this.promotionsService.updateOverrides(user, batchId, dto);
  }

  @ApiOperation({ summary: 'Apply a promotion batch (creates next-year enrollments and finalizes current year)' })
  @ApiOkResponse({
    schema: {
      example: {
        success: true,
        promotedCount: 100,
        detainedCount: 4,
        graduatedCount: 10,
        skippedCount: 0,
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Promotion batch not found' })
  @Scopes('students.lifecycle.write')
  @Post('promotion-batches/:batchId/apply')
  apply(@CurrentUser() user: AuthenticatedUser, @Param('batchId') batchId: string) {
    return this.promotionsService.apply(user, batchId);
  }
}
