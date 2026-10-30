import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskReminderDto } from './dto/create-task-reminder.dto';
import { ListTasksQueryDto } from './dto/list-tasks-query.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';

@ApiTags('workflows')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'List tasks in the authenticated tenant' })
  @ApiOkResponse({ type: [TaskResponseDto] })
  @Scopes('workflows.tasks.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListTasksQueryDto) { return this.tasksService.list(user, query); }

  @ApiOperation({ summary: 'Read one task' })
  @ApiOkResponse({ type: TaskResponseDto })
  @Scopes('workflows.tasks.read')
  @Get(':taskId')
  get(@CurrentUser() user: AuthenticatedUser, @Param('taskId') taskId: string) { return this.tasksService.getById(user, taskId); }

  @ApiOperation({ summary: 'Create a task and notify its assignee' })
  @ApiOkResponse({ type: TaskResponseDto })
  @Scopes('workflows.tasks.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTaskDto) { return this.tasksService.create(user, dto); }

  @ApiOperation({ summary: 'Update task status' })
  @ApiOkResponse({ type: TaskResponseDto })
  @Scopes('workflows.tasks.write')
  @Patch(':taskId/status')
  updateStatus(@CurrentUser() user: AuthenticatedUser, @Param('taskId') taskId: string, @Body() dto: UpdateTaskStatusDto) { return this.tasksService.updateStatus(user, taskId, dto); }

  @ApiOperation({ summary: 'Schedule a reminder for a task' })
  @ApiOkResponse({ type: TaskResponseDto })
  @Scopes('workflows.tasks.write')
  @Post(':taskId/reminders')
  addReminder(@CurrentUser() user: AuthenticatedUser, @Param('taskId') taskId: string, @Body() dto: CreateTaskReminderDto) { return this.tasksService.addReminder(user, taskId, dto); }

  @ApiOperation({ summary: 'Process due task reminders into in-app notifications' })
  @ApiOkResponse({ schema: { properties: { processed: { type: 'number' } } } })
  @Scopes('workflows.tasks.write')
  @Post('reminders/run')
  runDueReminders(@CurrentUser() user: AuthenticatedUser) { return this.tasksService.runDueReminders(user); }
}
