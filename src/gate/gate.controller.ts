import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Gate } from '@prisma/client';
import { GateService } from './gate.service';

@Controller('gate')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Get('status/:id')
  getStatus(@Param('id', ParseIntPipe) id: number): Promise<Gate> {
    return this.gateService.getStatus(id);
  }
}
