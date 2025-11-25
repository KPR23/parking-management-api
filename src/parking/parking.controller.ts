import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Ticket } from '@prisma/client';
import { EntryParkingDto } from './dto/parking-entry.dto';
import { ParkingExitResponse } from './dto/parking-exit-response.dto';
import { ExitParkingDto } from './dto/parking-exit.dto';
import { ParkingService } from './parking.service';

@ApiTags('Parking')
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Get('active/:plateNumber')
  @ApiOperation({ summary: 'Get active ticket by plate number' })
  @ApiResponse({ status: 200, description: 'Return the active ticket.' })
  @ApiResponse({ status: 404, description: 'Active ticket not found.' })
  getActiveTicket(@Param('plateNumber') plateNumber: string): Promise<Ticket> {
    return this.parkingService.getActiveTicketByPlate(plateNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200, description: 'Return the ticket.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  getTicket(@Param('id', ParseIntPipe) id: number): Promise<Ticket> {
    return this.parkingService.getTicket(id);
  }

  @Post('entry')
  @ApiOperation({ summary: 'Process vehicle entry' })
  @ApiResponse({ status: 201, description: 'Entry processed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createEntry(@Body() data: EntryParkingDto): Promise<Ticket> {
    return this.parkingService.entry(data.parkingLotId, data.plateNumber);
  }

  @Post('exit')
  @ApiOperation({ summary: 'Process vehicle exit' })
  @ApiResponse({ status: 201, description: 'Exit processed successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createExit(@Body() data: ExitParkingDto): Promise<ParkingExitResponse> {
    const result = await this.parkingService.exit(data.plateNumber);

    if (!result.exitTime) {
      throw new InternalServerErrorException('Exit time not set');
    }

    return result;
  }
}
