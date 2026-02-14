import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { ClassroomsController } from './classrooms/classrooms.controller';
import { ClassroomsService } from './classrooms/classrooms.service';
import { EnrollmentsController } from './enrollments/enrollments.controller';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { SubjectsController } from './subjects/subjects.controller';
import { SubjectsService } from './subjects/subjects.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClassroomsController, SubjectsController, EnrollmentsController],
  providers: [ClassroomsService, SubjectsService, EnrollmentsService],
  exports: [ClassroomsService, SubjectsService, EnrollmentsService],
})
export class AcademicsModule {}
