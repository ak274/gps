import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';
import { TeacherAttendanceController } from './teacher-attendance/teacher-attendance.controller';
import { TeacherAttendanceService } from './teacher-attendance/teacher-attendance.service';

@Module({
  imports: [PrismaModule],
  controllers: [AttendanceController, TeacherAttendanceController],
  providers: [AttendanceService, TeacherAttendanceService],
  exports: [AttendanceService, TeacherAttendanceService],
})
export class AttendanceModule {}
