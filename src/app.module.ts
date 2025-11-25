import { Module } from '@nestjs/common';
import { CameraModule } from './camera/camera.module';
import { CarsModule } from './cars/cars.module';
import { GateModule } from './gate/gate.module';
import { ParkingLotModule } from './parking-lot/parking-lot.module';
import { ParkingModule } from './parking/parking.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TicketsModule } from './tickets/tickets.module';

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
