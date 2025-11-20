import { Body, Controller, Post } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraDto } from './dto/camera.dto';

@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Post('entry')
  detectEntry(@Body() data: CameraDto) {
    return this.cameraService.handleEntry(data.plateNumber, data.gateId);
  }

  @Post('exit')
  detectExit(@Body() data: CameraDto) {
    return this.cameraService.handleExit(data.plateNumber, data.gateId);
  }
}
