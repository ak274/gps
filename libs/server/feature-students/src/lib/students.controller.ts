import { CurrentUser, Scopes } from '@gps/feature-auth';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListStudentsQueryDto } from './dto/list-students-query.dto';
import { ListStudentsResponseDto } from './dto/list-students-response.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { BulkImportStudentsDto } from './dto/bulk-import-students.dto';
import { BulkImportStudentsResponseDto } from './dto/bulk-import-students-response.dto';
import { BulkImportStudentsCsvDto } from './dto/bulk-import-students-csv.dto';

@ApiTags('students')
@ApiBearerAuth()
@Scopes('students.read')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @ApiOperation({ summary: 'List students in the authenticated tenant' })
  @ApiOkResponse({ type: ListStudentsResponseDto })
  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListStudentsQueryDto,
  ) {
    return this.studentsService.list(user, query);
  }

  @ApiOperation({ summary: 'Get student by ID in the authenticated tenant' })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Get(':studentId')
  findById(
    @CurrentUser() user: AuthenticatedUser,
    @Param('studentId') studentId: string,
  ) {
    return this.studentsService.findById(user, studentId);
  }

  @ApiOperation({ summary: 'Create student in the authenticated tenant' })
  @ApiOkResponse({ type: StudentResponseDto })
  @Scopes('students.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update student in the authenticated tenant' })
  @ApiOkResponse({ type: StudentResponseDto })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Scopes('students.write')
  @Patch(':studentId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('studentId') studentId: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(user, studentId, dto);
  }

  @ApiOperation({ summary: 'Soft-delete student in the authenticated tenant' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Scopes('students.write')
  @Delete(':studentId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('studentId') studentId: string) {
    return this.studentsService.remove(user, studentId);
  }

  @ApiOperation({ summary: 'Bulk import students via JSON array' })
  @ApiOkResponse({ type: BulkImportStudentsResponseDto })
  @Scopes('students.write')
  @Post('bulk-import')
  bulkImport(@CurrentUser() user: AuthenticatedUser, @Body() dto: BulkImportStudentsDto) {
    return this.studentsService.bulkImport(user, dto);
  }

  @ApiOperation({
    summary: 'Bulk import students via CSV upload',
    description:
      'Expected headers: admissionNo,firstName,lastName,gender,dateOfBirth,joinedOn,profilePhotoKey',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['schoolId', 'file'],
      properties: {
        schoolId: { type: 'string' },
        campusId: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({ type: BulkImportStudentsResponseDto })
  @Scopes('students.write')
  @UseInterceptors(FileInterceptor('file'))
  @Post('bulk-import/csv')
  bulkImportCsv(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BulkImportStudentsCsvDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentsService.bulkImportCsv(user, dto, file);
  }
}
