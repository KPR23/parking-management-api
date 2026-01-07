import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GateStatusDto } from './dto/gate-status.dto';
import { GateService } from './gate.service';

@ApiTags('Gates')
@Controller('gate')
export class GateController {
  constructor(private readonly gateService: GateService) {}

  @Get('status/:id')
  @ApiOperation({ summary: 'Get gate status' })
  @ApiResponse({ status: 200, description: 'Return the gate status.' })
  @ApiResponse({ status: 404, description: 'Gate not found.' })
  getStatus(@Param('id', ParseIntPipe) id: number): Promise<GateStatusDto> {
    return this.gateService.getStatus(id);
  }

  @Post('open/:id')
  @ApiOperation({ summary: 'Open the gate' })
  @ApiResponse({ status: 200, description: 'The gate has been opened.' })
  @ApiResponse({ status: 404, description: 'Gate not found.' })
  openGate(@Param('id', ParseIntPipe) id: number): Promise<GateStatusDto> {
    return this.gateService.openGate(id);
  }

  @Post('close/:id')
  @ApiOperation({ summary: 'Close the gate' })
  @ApiResponse({ status: 200, description: 'The gate has been closed.' })
  @ApiResponse({ status: 404, description: 'Gate not found.' })
  closeGate(@Param('id', ParseIntPipe) id: number): Promise<GateStatusDto> {
    return this.gateService.closeGate(id);
  }
}
