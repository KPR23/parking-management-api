import { Module } from '@nestjs/common';
import { ParkingLotController } from './parking-lot.controller.js';
import { ParkingLotService } from './parking-lot.service.js';

@Module({
  controllers: [ParkingLotController],
  providers: [ParkingLotService],
  exports: [ParkingLotService],
})
export class ParkingLotModule {}
