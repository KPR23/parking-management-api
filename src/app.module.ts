import { Module } from '@nestjs/common';
import { ParkingLotController } from './parking-lot/parking-lot.controller';
import { ParkingLotService } from './parking-lot/parking-lot.service';
import { ParkingController } from './parking/parking.controller';
import { ParkingService } from './parking/parking.service';
import { PrismaService } from './prisma/prisma.service';
import { SubscriptionController } from './subscription/subscription.controller';
import { SubscriptionService } from './subscription/subscription.service';
import { GateService } from './gate/gate.service';
import { CameraService } from './camera/camera.service';
import { CameraController } from './gate/camera/camera.controller';
import { CameraController } from './camera/camera.controller';
import { GateController } from './gate/gate.controller';

@Module({
  imports: [],
  controllers: [
    ParkingController,
    ParkingLotController,
    SubscriptionController,
    CameraController,
    GateController,
  ],
  providers: [
    ParkingService,
    PrismaService,
    ParkingLotService,
    SubscriptionService,
    GateService,
    CameraService,
  ],
})
export class AppModule {}
