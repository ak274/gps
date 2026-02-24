import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { RolloverService } from './rollover.service';
import { CopyAcademicStructureDto } from './dto/copy-academic-structure.dto';
import { SetCurrentAcademicYearDto } from './dto/set-current-academic-year.dto';

@ApiTags('student-lifecycle')
@ApiBearerAuth()
@Controller('lifecycle/rollover')
export class RolloverController {
  constructor(private readonly rolloverService: RolloverService) {}

  @ApiOperation({ summary: 'Copy academic structure (classes/sections + classroom-subject mappings) to next year' })
  @ApiOkResponse({
    schema: {
      example: { success: true, createdClassRooms: 10, createdClassroomSubjects: 80 },
    },
  })
  @Scopes('academics.rollover.write')
  @Post('academic-structure:copy')
  copyAcademicStructure(@CurrentUser() user: AuthenticatedUser, @Body() dto: CopyAcademicStructureDto) {
    return this.rolloverService.copyAcademicStructure(user, dto);
  }

  @ApiOperation({ summary: 'Set current academic year for a school (isCurrent=true), clearing others' })
  @ApiOkResponse({ schema: { example: { success: true } } })
  @Scopes('academics.rollover.write')
  @Post('set-current-academic-year')
  setCurrentAcademicYear(@CurrentUser() user: AuthenticatedUser, @Body() dto: SetCurrentAcademicYearDto) {
    return this.rolloverService.setCurrentAcademicYear(user, dto);
  }
}

