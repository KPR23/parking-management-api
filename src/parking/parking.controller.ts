import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { CreateEntryDto } from './dto/parking-entry.dto';
import { ParkingExitResponse } from './dto/parking-exit-response.dto';
import { CreateExitDto } from './dto/parking-exit.dto';
import { ParkingService } from './parking.service';

@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Get('active/:plateNumber')
  getActiveTicket(@Param('plateNumber') plateNumber: string): Promise<Ticket> {
    return this.parkingService.getActiveTicketByPlate(plateNumber);
  }

  @Get(':id')
  getTicket(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.parkingService.getTicket(id);
  }

  @Post('entry')
  createEntry(@Body() data: CreateEntryDto): Promise<Ticket> {
    return this.parkingService.entry(data.parkingLotId, data.plateNumber);
  }

  @Post('exit')
  async createExit(@Body() data: CreateExitDto): Promise<ParkingExitResponse> {
    const result = await this.parkingService.exit(data.plateNumber);

    if (!result.exitTime) {
      throw new InternalServerErrorException('Exit time not set');
    }

    return {
      id: result.id,
      entryTime: result.entryTime,
      exitTime: result.exitTime,
      totalAmount: result.totalAmount ?? 0,
      isPaid: result.isPaid,
      parkingLotId: result.parkingLotId,
      car: {
        id: result.car.id,
        plateNumber: result.car.plateNumber,
        subscription: result.car.subscription,
      },
    };
  }
}
