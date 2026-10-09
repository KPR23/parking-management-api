import { Module } from '@nestjs/common';
import { CameraModule } from './camera/camera.module.js';
import { CarsModule } from './cars/cars.module.js';
import { GateModule } from './gate/gate.module.js';
import { ParkingModule } from './parking/parking.module.js';
import { ParkingLotModule } from './parking-lot/parking-lot.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SubscriptionModule } from './subscription/subscription.module.js';
import { TicketsModule } from './tickets/tickets.module.js';

@Module({
  imports: [
    PrismaModule,
    TicketsModule,
    ParkingModule,
    ParkingLotModule,
    SubscriptionModule,
    CameraModule,
    GateModule,
    PaymentsModule,
    CarsModule,
  ],
})
export class AppModule {}
