import { Module } from '@nestjs/common';
import { ParkingLotController } from './parking-lot/parking-lot.controller';
import { ParkingLotService } from './parking-lot/parking-lot.service';
import { ParkingController } from './parking/parking.controller';
import { ParkingService } from './parking/parking.service';
import { PrismaService } from './prisma/prisma.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';

@Module({
  imports: [],
  controllers: [
    ParkingController,
    ParkingLotController,
    SubscriptionController,
  ],
  providers: [
    ParkingService,
    PrismaService,
    ParkingLotService,
    SubscriptionService,
  ],
})
export class AppModule {}
