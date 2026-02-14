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
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { CreateClassWithSectionsDto } from './dto/create-class-with-sections.dto';
import { ClassWithSectionsResponseDto } from './dto/class-with-sections-response.dto';
import { ClassroomResponseDto } from './dto/classroom-response.dto';
import { ListClassSectionsQueryDto } from './dto/list-class-sections-query.dto';
import { ListClassroomsQueryDto } from './dto/list-classrooms-query.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomsService } from './classrooms.service';

@ApiTags('classrooms')
@ApiBearerAuth()
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @ApiOperation({ summary: 'List classrooms in authenticated tenant' })
  @ApiOkResponse({ type: [ClassroomResponseDto] })
  @Scopes('classrooms.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListClassroomsQueryDto) {
    return this.classroomsService.list(user, query);
  }

  @ApiOperation({ summary: 'List classes grouped with sections' })
  @ApiOkResponse({ type: [ClassWithSectionsResponseDto] })
  @Scopes('classrooms.read')
  @Get('with-sections')
  listWithSections(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListClassSectionsQueryDto,
  ) {
    return this.classroomsService.listWithSections(user, query);
  }

  @ApiOperation({ summary: 'Get classroom by id in authenticated tenant' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  @ApiNotFoundResponse({ description: 'Classroom not found' })
  @Scopes('classrooms.read')
  @Get(':classroomId')
  findById(@CurrentUser() user: AuthenticatedUser, @Param('classroomId') classroomId: string) {
    return this.classroomsService.findById(user, classroomId);
  }

  @ApiOperation({ summary: 'Create classroom in authenticated tenant' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  @ApiConflictResponse({ description: 'Duplicate classroom name for academic year' })
  @Scopes('classrooms.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateClassroomDto) {
    return this.classroomsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Create a class and multiple sections in one request' })
  @ApiOkResponse({ type: [ClassroomResponseDto] })
  @ApiConflictResponse({ description: 'One or more sections already exist for this class/year' })
  @Scopes('classrooms.write')
  @Post('with-sections')
  createWithSections(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateClassWithSectionsDto,
  ) {
    return this.classroomsService.createWithSections(user, dto);
  }

  @ApiOperation({ summary: 'Update classroom in authenticated tenant' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  @ApiNotFoundResponse({ description: 'Classroom not found' })
  @Scopes('classrooms.write')
  @Patch(':classroomId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('classroomId') classroomId: string,
    @Body() dto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(user, classroomId, dto);
  }
}
