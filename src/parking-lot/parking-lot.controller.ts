import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ParkingLot } from '@prisma/client';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Get()
  getAll(): Promise<ParkingLot[] | null> {
    return this.parkingLotService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number): Promise<ParkingLot | null> {
    return this.parkingLotService.getById(Number(id));
  }

  @Post()
  create(@Body() data: CreateParkingLotDto): Promise<ParkingLot> {
    return this.parkingLotService.create(data);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateParkingLotDto,
  ): Promise<ParkingLot> {
    return this.parkingLotService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<ParkingLot> {
    return this.parkingLotService.delete(Number(id));
  }
}
