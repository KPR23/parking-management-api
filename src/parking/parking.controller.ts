import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateEntryDto } from './dto/parking-entry.dto';
import { CreateExitDto } from './dto/parking-exit.dto';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Get('active/:plateNumber')
  getActiveTicket(
    @Param('plateNumber') plateNumber: string,
  ): Promise<Ticket | null> {
    return this.parkingService.getActiveTicketByPlate(plateNumber);
  }

  @Get(':id')
  getTicket(@Param('id') id: number): Promise<Ticket | null> {
    return this.parkingService.getTicket(Number(id));
  }

  @Post('entry')
  createEntry(@Body() data: CreateEntryDto): Promise<Ticket> {
    return this.parkingService.entry(data.parkingLotId, data.plateNumber);
  }

  @Post('exit')
  createExit(@Body() data: CreateExitDto): Promise<Ticket> {
    return this.parkingService.exit(data.plateNumber);
  }
}
