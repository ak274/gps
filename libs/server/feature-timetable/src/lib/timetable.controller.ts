import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateTimetableEntryDto } from './dto/create-timetable-entry.dto';
import { ListTimetableEntriesQueryDto } from './dto/list-timetable-entries-query.dto';
import { TimetableEntryResponseDto } from './dto/timetable-entry-response.dto';
import { UpdateTimetableEntryDto } from './dto/update-timetable-entry.dto';
import { TimetableService } from './timetable.service';

@ApiTags('timetable')
@ApiBearerAuth()
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @ApiOperation({ summary: 'List timetable entries in authenticated tenant' })
  @ApiOkResponse({ type: [TimetableEntryResponseDto] })
  @Scopes('timetable.read')
  @Get('entries')
  listEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListTimetableEntriesQueryDto,
  ) {
    return this.timetableService.listEntries(user, query);
  }

  @ApiOperation({ summary: 'Get timetable entry by id' })
  @ApiOkResponse({ type: TimetableEntryResponseDto })
  @ApiNotFoundResponse({ description: 'Timetable entry not found' })
  @Scopes('timetable.read')
  @Get('entries/:entryId')
  findEntryById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('entryId') entryId: string,
  ) {
    return this.timetableService.findEntryById(user, entryId);
  }

  @ApiOperation({ summary: 'Create timetable entry' })
  @ApiOkResponse({ type: TimetableEntryResponseDto })
  @ApiNotFoundResponse({ description: 'Classroom, subject, or teacher not found' })
  @ApiConflictResponse({ description: 'Timetable conflict for class/day/start time' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid time range' })
  @Scopes('timetable.write')
  @Post('entries')
  createEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateTimetableEntryDto,
  ) {
    return this.timetableService.createEntry(user, dto);
  }

  @ApiOperation({ summary: 'Update timetable entry' })
  @ApiOkResponse({ type: TimetableEntryResponseDto })
  @ApiNotFoundResponse({ description: 'Timetable entry not found' })
  @ApiConflictResponse({ description: 'Timetable conflict for class/day/start time' })
  @ApiUnprocessableEntityResponse({ description: 'Invalid time range' })
  @Scopes('timetable.write')
  @Patch('entries/:entryId')
  updateEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('entryId') entryId: string,
    @Body() dto: UpdateTimetableEntryDto,
  ) {
    return this.timetableService.updateEntry(user, entryId, dto);
  }

  @ApiOperation({ summary: 'Soft-delete timetable entry' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Timetable entry not found' })
  @Scopes('timetable.write')
  @Delete('entries/:entryId')
  deleteEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('entryId') entryId: string,
  ) {
    return this.timetableService.deleteEntry(user, entryId);
  }
}
