import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ApprovalsController } from './approvals.controller';
import { ApprovalsService } from './approvals.service';

@Module({
  imports: [PrismaModule],
  controllers: [TasksController, ApprovalsController],
  providers: [TasksService, ApprovalsService],
  exports: [TasksService, ApprovalsService],
})
export class WorkflowsModule {}
