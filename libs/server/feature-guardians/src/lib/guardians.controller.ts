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
} from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { CreateGuardianDto } from './dto/create-guardian.dto';
import { GuardianResponseDto } from './dto/guardian-response.dto';
import { LinkStudentGuardianDto } from './dto/link-student-guardian.dto';
import { ListGuardiansQueryDto } from './dto/list-guardians-query.dto';
import { StudentGuardianLinkResponseDto } from './dto/student-guardian-link-response.dto';
import { StudentSummaryResponseDto } from './dto/student-summary-response.dto';
import { UpdateGuardianDto } from './dto/update-guardian.dto';
import { GuardiansService } from './guardians.service';

@ApiTags('guardians')
@ApiBearerAuth()
@Controller('guardians')
export class GuardiansController {
  constructor(private readonly guardiansService: GuardiansService) {}

  @ApiOperation({ summary: 'List guardians in authenticated tenant' })
  @ApiOkResponse({ type: [GuardianResponseDto] })
  @Scopes('guardians.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListGuardiansQueryDto) {
    return this.guardiansService.list(user, query);
  }

  @ApiOperation({ summary: 'Get guardian by id' })
  @ApiOkResponse({ type: GuardianResponseDto })
  @ApiNotFoundResponse({ description: 'Guardian not found' })
  @Scopes('guardians.read')
  @Get(':guardianId')
  findById(@CurrentUser() user: AuthenticatedUser, @Param('guardianId') guardianId: string) {
    return this.guardiansService.findById(user, guardianId);
  }

  @ApiOperation({ summary: 'Create guardian profile' })
  @ApiOkResponse({ type: GuardianResponseDto })
  @ApiConflictResponse({ description: 'Guardian user conflict for school' })
  @Scopes('guardians.write')
  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGuardianDto) {
    return this.guardiansService.create(user, dto);
  }

  @ApiOperation({ summary: 'Update guardian profile' })
  @ApiOkResponse({ type: GuardianResponseDto })
  @ApiNotFoundResponse({ description: 'Guardian not found' })
  @Scopes('guardians.write')
  @Patch(':guardianId')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guardianId') guardianId: string,
    @Body() dto: UpdateGuardianDto,
  ) {
    return this.guardiansService.update(user, guardianId, dto);
  }

  @ApiOperation({ summary: 'Link guardian to student' })
  @ApiOkResponse({ type: StudentGuardianLinkResponseDto })
  @ApiConflictResponse({ description: 'Link already exists or school mismatch' })
  @ApiNotFoundResponse({ description: 'Guardian or student not found' })
  @Scopes('guardians.write')
  @Post(':guardianId/students/:studentId')
  linkStudent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guardianId') guardianId: string,
    @Param('studentId') studentId: string,
    @Body() dto: LinkStudentGuardianDto,
  ) {
    return this.guardiansService.linkStudent(user, guardianId, studentId, dto);
  }

  @ApiOperation({ summary: 'Unlink guardian from student' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @ApiNotFoundResponse({ description: 'Student guardian link not found' })
  @Scopes('guardians.write')
  @Delete(':guardianId/students/:studentId')
  unlinkStudent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('guardianId') guardianId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.guardiansService.unlinkStudent(user, guardianId, studentId);
  }

  @ApiOperation({ summary: 'List guardians linked to a student' })
  @ApiOkResponse({ type: [GuardianResponseDto] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Scopes('guardians.read')
  @Get('student/:studentId')
  listStudentGuardians(
    @CurrentUser() user: AuthenticatedUser,
    @Param('studentId') studentId: string,
  ) {
    return this.guardiansService.listStudentGuardians(user, studentId);
  }

  @ApiOperation({ summary: 'List sibling students for a student via shared guardians' })
  @ApiOkResponse({ type: [StudentSummaryResponseDto] })
  @ApiNotFoundResponse({ description: 'Student not found' })
  @Scopes('guardians.read')
  @Get('student/:studentId/siblings')
  listSiblingsByStudent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('studentId') studentId: string,
  ) {
    return this.guardiansService.listSiblingsByStudent(user, studentId);
  }
}
