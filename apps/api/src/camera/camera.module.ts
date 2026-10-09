import { Module } from '@nestjs/common';
import { GateModule } from '../gate/gate.module.js';
import { ParkingModule } from '../parking/parking.module.js';
import { CameraController } from './camera.controller.js';
import { CameraService } from './camera.service.js';

@Module({
  imports: [ParkingModule, GateModule],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
