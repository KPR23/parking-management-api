import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Car } from '../generated/prisma/client.js';
import { CarService } from './cars.service.js';
import { CreateCarDto } from './dto/cars-create.dto.js';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get(':id')
  getCarById(@Param('id', ParseIntPipe) id: number): Promise<Car> {
    return this.carService.findById(id);
  }

  @Get('plate/:plateNumber')
  getCarByPlateNumber(@Param('plateNumber') plateNumber: string): Promise<Car> {
    return this.carService.findByPlate(plateNumber);
  }

  @Post()
  createCar(@Body() { plateNumber }: CreateCarDto): Promise<Car> {
    return this.carService.findOrCreate(plateNumber);
  }
}
