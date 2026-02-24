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
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { HomeworkResponseDto } from './dto/homework-response.dto';
import { ListHomeworkQueryDto } from './dto/list-homework-query.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { HomeworkService } from './homework.service';

@ApiTags('homework')
@ApiBearerAuth()
@Controller('homework')
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @ApiOperation({ summary: 'List homework in authenticated tenant' })
  @ApiOkResponse({ type: [HomeworkResponseDto] })
  @Scopes('homework.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListHomeworkQueryDto) {
    return this.homeworkService.list(user, query);
  }

  @ApiOperation({ summary: 'Get homework by id in authenticated tenant' })
  @ApiOkResponse({ type: HomeworkResponseDto })
  @ApiNotFoundResponse({ description: 'Homework not found' })
  @Scopes('homework.read')
  @Get(':homeworkId')
  findById(@CurrentUser() user: AuthenticatedUser, @Param('homeworkId') homeworkId: string) {
    return this.homeworkService.findById(user, homeworkId);
  }

  @ApiOperation({ summary: 'Create homework in authenticated tenant' })
  @ApiOkResponse({ type: HomeworkResponseDto })
  @Scopes('homework.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateHomeworkDto) {
    return this.homeworkService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update homework in authenticated tenant' })
  @ApiOkResponse({ type: HomeworkResponseDto })
  @ApiNotFoundResponse({ description: 'Homework not found' })
  @Scopes('homework.write')
  @Patch(':homeworkId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('homeworkId') homeworkId: string,
    @Body() dto: UpdateHomeworkDto,
  ) {
    return this.homeworkService.update(user, homeworkId, dto);
  }

  @ApiOperation({ summary: 'Soft-delete homework in authenticated tenant' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Homework not found' })
  @Scopes('homework.write')
  @Delete(':homeworkId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('homeworkId') homeworkId: string) {
    return this.homeworkService.remove(user, homeworkId);
  }
}

