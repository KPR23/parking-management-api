
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Ticket } from '@prisma/client';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tickets with optional plate number filter' })
  @ApiResponse({ status: 200, description: 'Return all tickets.' })
  async findAll(
    @Query('plateNumber') plateNumber?: string,
  ): Promise<Ticket[]> {
    return this.ticketsService.findAll({ plateNumber });
  }
}
