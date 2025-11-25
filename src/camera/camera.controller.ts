import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CameraService } from './camera.service';
import { CameraDto } from './dto/camera.dto';

@ApiTags('Camera')
@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Post('entry')
  @ApiOperation({ summary: 'Detect vehicle entry' })
  @ApiResponse({ status: 201, description: 'Entry detected successfully.' })
  detectEntry(@Body() data: CameraDto) {
    return this.cameraService.handleEntry(data.plateNumber, data.gateId);
  }

  @Post('exit')
  @ApiOperation({ summary: 'Detect vehicle exit' })
  @ApiResponse({ status: 201, description: 'Exit detected successfully.' })
  detectExit(@Body() data: CameraDto) {
    return this.cameraService.handleExit(data.plateNumber, data.gateId);
  }
}
