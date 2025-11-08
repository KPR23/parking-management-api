import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateEntryDto } from './dto/create-entry.dto';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Post('entry')
  createEntry(@Body() data: CreateEntryDto): Promise<Ticket> {
    return this.parkingService.createEntry(data.plateNumber);
  }

  @Post('exit')
  createExit(@Body() data: { plateNumber: string }) {
    return this.parkingService.createExit(data.plateNumber);
  }

  @Get(':id')
  getTicket(@Param('id') id: number): Promise<Ticket> {
    return this.parkingService.getTicket(Number(id));
  }
}
