import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParkingLot } from '@prisma/client';
import { CreateParkingLotDto } from './dto/parking-lot-create.dto';
import { UpdateParkingLotDto } from './dto/parking-lot-update.dto';
import { ParkingLotService } from './parking-lot.service';

@ApiTags('Parking Lots')
@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parking lots' })
  @ApiResponse({ status: 200, description: 'Return all parking lots.' })
  getAll(): Promise<ParkingLot[]> {
    return this.parkingLotService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a parking lot by id' })
  @ApiResponse({ status: 200, description: 'Return a parking lot.' })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  getById(@Param('id', ParseIntPipe) id: number): Promise<ParkingLot> {
    return this.parkingLotService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new parking lot' })
  @ApiResponse({
    status: 201,
    description: 'The parking lot has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() data: CreateParkingLotDto): Promise<ParkingLot> {
    return this.parkingLotService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a parking lot' })
  @ApiResponse({
    status: 200,
    description: 'The parking lot has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateParkingLotDto,
  ): Promise<ParkingLot> {
    return this.parkingLotService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a parking lot' })
  @ApiResponse({
    status: 200,
    description: 'The parking lot has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Parking lot not found.' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<ParkingLot> {
    return this.parkingLotService.delete(id);
  }
}
