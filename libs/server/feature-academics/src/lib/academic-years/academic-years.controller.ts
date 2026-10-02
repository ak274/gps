import { Controller, Get, Query } from '@nestjs/common';
import { CurrentUser, Scopes } from '@gps/feature-auth';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '@gps/feature-auth';
import { PrismaService } from '@gps/data-access-db';
import { IsOptional, IsString } from 'class-validator';

class ListAcademicYearsQueryDto {
  @IsOptional()
  @IsString()
  schoolId?: string;
}

@ApiTags('academic-years')
@ApiBearerAuth()
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: 'List academic years visible to the authenticated tenant' })
  @ApiOkResponse({ schema: { type: 'array', items: { type: 'object' } } })
  @Scopes('schools.read')
  @Get()
  list(@CurrentUser() user: AuthenticatedUser, @Query() query: ListAcademicYearsQueryDto) {
    return this.prisma.academicYear.findMany({
      where: {
        tenantId: user.tenantId,
        deletedAt: null,
        ...(query.schoolId ? { schoolId: query.schoolId } : {}),
      },
      select: { id: true, schoolId: true, name: true, startsOn: true, endsOn: true, isCurrent: true },
      orderBy: [{ isCurrent: 'desc' }, { startsOn: 'desc' }],
    });
  }
}
