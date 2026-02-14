import { Module } from '@nestjs/common';
import { PrismaModule } from '@gps/data-access-db';
import { CommunicationsController } from './communications.controller';
import { CommunicationsService } from './communications.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
