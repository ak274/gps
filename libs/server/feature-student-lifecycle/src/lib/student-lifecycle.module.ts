import { PrismaModule } from '@gps/data-access-db';
import { Module } from '@nestjs/common';
import { PromotionsController } from './promotions/promotions.controller';
import { PromotionsService } from './promotions/promotions.service';
import { ExitRequestsController } from './exit/exit-requests.controller';
import { ExitRequestsService } from './exit/exit-requests.service';
import { RolloverController } from './rollover/rollover.controller';
import { RolloverService } from './rollover/rollover.service';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionsController, ExitRequestsController, RolloverController],
  providers: [PromotionsService, ExitRequestsService, RolloverService],
  exports: [PromotionsService, ExitRequestsService, RolloverService],
})
export class StudentLifecycleModule {}

