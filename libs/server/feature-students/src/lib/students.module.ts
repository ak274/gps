import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  imports: [PrismaModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
