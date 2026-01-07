import { Module } from '@nestjs/common';
import { CarsModule } from 'src/cars/cars.module';
import { ParkingLotModule } from 'src/parking-lot/parking-lot.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

@Module({
  imports: [ParkingLotModule, CarsModule, TicketsModule, PaymentsModule],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
