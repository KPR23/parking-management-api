import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { GateStatusDto } from './dto/gate-status.dto';
import { GateService } from './gate.service';

@Controller('gate')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Get('status/:id')
  getStatus(@Param('id', ParseIntPipe) id: number): Promise<GateStatusDto> {
    return this.gateService.getStatus(id);
  }

  @Post('open/:id')
  openGate(@Param('id', ParseIntPipe) id: number): Promise<GateStatusDto> {
    return this.gateService.openGate(id);
  }

  @Post('close/:id')
  closeGate(@Param('id', ParseIntPipe) id: number): Promise<GateStatusDto> {
    return this.gateService.closeGate(id);
  }
}
