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
import { PreviewStudentsImportResponseDto } from './dto/preview-students-import-response.dto';
import { CreateFamilyDto } from './dto/create-family.dto';
import { LinkFamilyMemberDto } from './dto/link-family-member.dto';
import { CreateFamilyAlumniDto } from './dto/create-family-alumni.dto';
import { CreateFamilyBenefitDto } from './dto/create-family-benefit.dto';
import { FamilyResponseDto } from './dto/family-response.dto';

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

  @ApiOperation({ summary: 'List family groups in the authenticated tenant' })
  @ApiOkResponse({ type: [FamilyResponseDto] })
  @Scopes('students.read')
  @Get('families')
  listFamilies(@CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.listFamilies(user);
  }

  @ApiOperation({ summary: 'Create a family group' })
  @ApiOkResponse({ type: FamilyResponseDto })
  @Scopes('students.write')
  @Post('families')
  createFamily(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateFamilyDto) {
    return this.studentsService.createFamily(user, dto);
  }

  @ApiOperation({ summary: 'Get a family profile with students, guardians, alumni and benefits' })
  @ApiOkResponse({ type: FamilyResponseDto })
  @Scopes('students.read')
  @Get('families/:familyId')
  getFamily(@CurrentUser() user: AuthenticatedUser, @Param('familyId') familyId: string) {
    return this.studentsService.getFamily(user, familyId);
  }

  @ApiOperation({ summary: 'Link a student to a family' })
  @ApiOkResponse({ type: FamilyResponseDto })
  @Scopes('students.write')
  @Post('families/:familyId/students')
  linkFamilyStudent(@CurrentUser() user: AuthenticatedUser, @Param('familyId') familyId: string, @Body() dto: LinkFamilyMemberDto) {
    return this.studentsService.linkFamilyStudent(user, familyId, dto);
  }

  @ApiOperation({ summary: 'Link a guardian to a family' })
  @ApiOkResponse({ type: FamilyResponseDto })
  @Scopes('students.write')
  @Post('families/:familyId/guardians')
  linkFamilyGuardian(@CurrentUser() user: AuthenticatedUser, @Param('familyId') familyId: string, @Body() dto: LinkFamilyMemberDto) {
    return this.studentsService.linkFamilyGuardian(user, familyId, dto);
  }

  @ApiOperation({ summary: 'Record a family member who is an alumnus' })
  @ApiOkResponse({ type: FamilyResponseDto })
  @Scopes('students.write')
  @Post('families/:familyId/alumni')
  addFamilyAlumni(@CurrentUser() user: AuthenticatedUser, @Param('familyId') familyId: string, @Body() dto: CreateFamilyAlumniDto) {
    return this.studentsService.addFamilyAlumni(user, familyId, dto);
  }

  @ApiOperation({ summary: 'Create a sibling discount, waiver or family charge rule' })
  @ApiOkResponse({ type: FamilyResponseDto })
  @Scopes('students.write')
  @Post('families/:familyId/benefits')
  addFamilyBenefit(@CurrentUser() user: AuthenticatedUser, @Param('familyId') familyId: string, @Body() dto: CreateFamilyBenefitDto) {
    return this.studentsService.addFamilyBenefit(user, familyId, dto);
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
    summary: 'Preview student CSV import',
    description:
      'Parses and validates a CSV without writing records. Expected headers: admissionNo,firstName,lastName,gender,dateOfBirth,joinedOn,profilePhotoKey',
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
  @ApiOkResponse({ type: PreviewStudentsImportResponseDto })
  @Scopes('students.write')
  @UseInterceptors(FileInterceptor('file'))
  @Post('bulk-import/csv/preview')
  previewBulkImportCsv(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BulkImportStudentsCsvDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentsService.previewBulkImportCsv(user, dto, file);
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
