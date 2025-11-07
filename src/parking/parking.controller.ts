import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { Ticket } from './parking.service';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('entry')
  createEntry(@Body() data: { plateNumber: string }): Ticket {
    return this.parkingService.createEntry(data.plateNumber);
  }

  @Post('exit/:id')
  createExit(@Param('id') id: number): Ticket | string {
    return this.parkingService.createExit(Number(id));
  }

  @Get(':id')
  getTicket(@Param('id') id: number): Ticket | string {
    return this.parkingService.getTicket(Number(id));
  }
}
