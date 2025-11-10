import { Module } from '@nestjs/common';
import { ParkingController } from './parking/parking.controller';
import { ParkingService } from './parking/parking.service';
import { PrismaService } from './prisma/prisma.service';
import { ParkingLotController } from './parking-lot/parking-lot.controller';
import { ParkingLotService } from './parking-lot/parking-lot.service';
import { ParkingLotModule } from './parking-lot/parking-lot.module';

@Module({
  imports: [ParkingLotModule],
  controllers: [ParkingController, ParkingLotController],
  providers: [ParkingService, PrismaService, ParkingLotService],
})
export class AppModule {}
