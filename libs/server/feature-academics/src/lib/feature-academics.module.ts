import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { ClassroomsController } from './classrooms/classrooms.controller';
import { ClassroomsService } from './classrooms/classrooms.service';
import { EnrollmentsController } from './enrollments/enrollments.controller';
import { EnrollmentsService } from './enrollments/enrollments.service';
import { SubjectsController } from './subjects/subjects.controller';
import { SubjectsService } from './subjects/subjects.service';
import { ClassroomSubjectsController } from './classroom-subjects/classroom-subjects.controller';
import { ClassroomSubjectsService } from './classroom-subjects/classroom-subjects.service';
import { AcademicYearsController } from './academic-years/academic-years.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ClassroomsController, SubjectsController, EnrollmentsController, ClassroomSubjectsController, AcademicYearsController],
  providers: [ClassroomsService, SubjectsService, EnrollmentsService, ClassroomSubjectsService],
  exports: [ClassroomsService, SubjectsService, EnrollmentsService, ClassroomSubjectsService],
})
export class AcademicsModule {}
