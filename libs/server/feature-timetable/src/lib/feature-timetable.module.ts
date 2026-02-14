import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './timetable.service';

@Module({
  imports: [PrismaModule],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService],
})
export class TimetableModule {}
