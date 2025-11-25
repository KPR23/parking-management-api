import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Car } from '@prisma/client';
import { CarService } from './cars.service';
import { CreateCarDto } from './dto/cars-create.dto';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiResponse({ status: 200, description: 'Return the car.' })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  getCarById(@Param('id', ParseIntPipe) id: number): Promise<Car> {
    return this.carService.findById(id);
  }

  @Get('plate/:plateNumber')
  @ApiOperation({ summary: 'Get car by plate number' })
  @ApiResponse({ status: 200, description: 'Return the car.' })
  @ApiResponse({ status: 404, description: 'Car not found.' })
  getCarByPlateNumber(@Param('plateNumber') plateNumber: string): Promise<Car> {
    return this.carService.findByPlate(plateNumber);
  }

  @Post()
  @ApiOperation({ summary: 'Create or find a car' })
  @ApiResponse({
    status: 201,
    description: 'The car has been successfully created or found.',
  })
  createCar(@Body() { plateNumber }: CreateCarDto): Promise<Car> {
    return this.carService.findOrCreate(plateNumber);
  }
}
