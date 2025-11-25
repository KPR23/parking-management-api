import { Module } from '@nestjs/common';
import { GateModule } from 'src/gate/gate.module';
import { ParkingModule } from 'src/parking/parking.module';
import { CameraController } from './camera.controller';
import { CameraService } from './camera.service';

@Module({
  imports: [ParkingModule, GateModule],
  controllers: [CameraController],
  providers: [CameraService],
})
export class CameraModule {}
