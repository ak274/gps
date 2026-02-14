import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [PrismaModule],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
