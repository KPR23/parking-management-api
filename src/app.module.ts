import { Module } from '@nestjs/common';
import { CameraController } from './camera/camera.controller';
import { CameraService } from './camera/camera.service';
import { GateController } from './gate/gate.controller';
import { GateService } from './gate/gate.service';
import { ParkingLotController } from './parking-lot/parking-lot.controller';
import { ParkingLotService } from './parking-lot/parking-lot.service';
import { ParkingController } from './parking/parking.controller';
import { ParkingService } from './parking/parking.service';
import { PrismaService } from './prisma/prisma.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/payments.service';

@Module({
  imports: [],
  controllers: [
    ParkingController,
    ParkingLotController,
    SubscriptionController,
    CameraController,
    GateController,
    PaymentsController,
  ],
  providers: [
    ParkingService,
    PrismaService,
    ParkingLotService,
    SubscriptionService,
    GateService,
    CameraService,
    PaymentsService,
  ],
})
export class AppModule {}
