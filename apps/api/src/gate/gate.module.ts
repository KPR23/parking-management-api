import { Module } from '@nestjs/common';
import { GateController } from './gate.controller.js';
import { GateService } from './gate.service.js';

@Module({
  controllers: [GateController],
  providers: [GateService],
  exports: [GateService],
})
export class GateModule {}
