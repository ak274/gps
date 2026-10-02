import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { ListStaffQueryDto } from './dto/list-staff-query.dto';
import { StaffResponseDto } from './dto/staff-response.dto';
import { TeacherResponseDto } from './dto/teacher-response.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { StaffService } from './staff.service';
import { StaffImportCsvDto } from './dto/staff-import-csv.dto';
import { StaffImportCommitDto, StaffImportCommitResponseDto, StaffImportPreviewResponseDto } from './dto/staff-import-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('staff')
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiOperation({ summary: 'Preview staff CSV import without writing records' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', required: ['schoolId', 'file'], properties: { schoolId: { type: 'string' }, campusId: { type: 'string' }, file: { type: 'string', format: 'binary' } } } })
  @ApiOkResponse({ type: StaffImportPreviewResponseDto })
  @Scopes('staff.write')
  @UseInterceptors(FileInterceptor('file'))
  @Post('import/csv/preview')
  previewImport(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: StaffImportCsvDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.staffService.previewImportCsv(user, dto, file);
  }

  @ApiOperation({ summary: 'Commit reviewed staff import records' })
  @ApiOkResponse({ type: StaffImportCommitResponseDto })
  @Scopes('staff.write')
  @Post('import')
  commitImport(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: StaffImportCsvDto & StaffImportCommitDto,
  ) {
    const { schoolId, campusId, records } = body;
    return this.staffService.commitImport(user, { schoolId, campusId }, { records });
  }

  @ApiOperation({ summary: 'List staff profiles' })
  @ApiOkResponse({ type: [StaffResponseDto] })
  @Scopes('staff.read')
  @Get()
  listStaff(@CurrentUser() user: AuthenticatedUser, @Query() query: ListStaffQueryDto) {
    return this.staffService.listStaff(user, query);
  }

  @ApiOperation({ summary: 'Get staff profile by id' })
  @ApiOkResponse({ type: StaffResponseDto })
  @ApiNotFoundResponse({ description: 'Staff profile not found' })
  @Scopes('staff.read')
  @Get(':staffId')
  findStaffById(@CurrentUser() user: AuthenticatedUser, @Param('staffId') staffId: string) {
    return this.staffService.findStaffById(user, staffId);
  }

  @ApiOperation({ summary: 'Create staff profile' })
  @ApiOkResponse({ type: StaffResponseDto })
  @ApiConflictResponse({ description: 'Employee code or school-user duplicate' })
  @Scopes('staff.write')
  @Post()
  createStaff(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStaffDto) {
    return this.staffService.createStaff(user, dto);
  }

  @ApiOperation({ summary: 'Update staff profile' })
  @ApiOkResponse({ type: StaffResponseDto })
  @ApiNotFoundResponse({ description: 'Staff profile not found' })
  @Scopes('staff.write')
  @Patch(':staffId')
  updateStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('staffId') staffId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.updateStaff(user, staffId, dto);
  }

  @ApiOperation({ summary: 'List teacher profiles' })
  @ApiOkResponse({ type: [TeacherResponseDto] })
  @Scopes('teachers.read')
  @Get('teachers/list')
  listTeachers(@CurrentUser() user: AuthenticatedUser) {
    return this.staffService.listTeachers(user);
  }

  @ApiOperation({ summary: 'Get teacher profile by id' })
  @ApiOkResponse({ type: TeacherResponseDto })
  @ApiNotFoundResponse({ description: 'Teacher profile not found' })
  @Scopes('teachers.read')
  @Get('teachers/:teacherId')
  findTeacherById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('teacherId') teacherId: string,
  ) {
    return this.staffService.findTeacherById(user, teacherId);
  }

  @ApiOperation({ summary: 'Create teacher profile from staff profile' })
  @ApiOkResponse({ type: TeacherResponseDto })
  @ApiNotFoundResponse({ description: 'Staff profile not found' })
  @ApiConflictResponse({ description: 'Teacher profile already exists for staff profile' })
  @Scopes('teachers.write')
  @Post('teachers')
  createTeacher(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTeacherDto) {
    return this.staffService.createTeacher(user, dto);
  }

  @ApiOperation({ summary: 'Update teacher profile' })
  @ApiOkResponse({ type: TeacherResponseDto })
  @ApiNotFoundResponse({ description: 'Teacher profile not found' })
  @Scopes('teachers.write')
  @Patch('teachers/:teacherId')
  updateTeacher(
    @CurrentUser() user: AuthenticatedUser,
    @Param('teacherId') teacherId: string,
    @Body() dto: UpdateTeacherDto,
  ) {
    return this.staffService.updateTeacher(user, teacherId, dto);
  }
}
