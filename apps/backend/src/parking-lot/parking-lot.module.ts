import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ParkingLotController } from './parking-lot.controller';
import { ParkingLotService } from './parking-lot.service';

@Module({
  imports: [PrismaModule],
  controllers: [ParkingLotController],
  providers: [ParkingLotService],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}
