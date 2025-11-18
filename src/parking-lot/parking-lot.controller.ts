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
import { ParkingLot } from '@prisma/client';
import { CreateParkingLotDto } from './dto/parking-lot-create.dto';
import { UpdateParkingLotDto } from './dto/parking-lot-update.dto';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get()
  getAll(): Promise<ParkingLot[]> {
    return this.parkingLotService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<ParkingLot> {
    return this.parkingLotService.getById(id);
  }

  @Post()
  create(@Body() data: CreateParkingLotDto): Promise<ParkingLot> {
    return this.parkingLotService.create(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateParkingLotDto,
  ): Promise<ParkingLot> {
    return this.parkingLotService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<ParkingLot> {
    return this.parkingLotService.delete(id);
  }
}
