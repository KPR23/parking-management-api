import { Module } from '@nestjs/common';
import { CarsModule } from '../cars/cars.module.js';
import { ParkingLotModule } from '../parking-lot/parking-lot.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { TicketsModule } from '../tickets/tickets.module.js';
import { ParkingController } from './parking.controller.js';
import { ParkingService } from './parking.service.js';

@Module({
  imports: [ParkingLotModule, CarsModule, TicketsModule, PaymentsModule],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
