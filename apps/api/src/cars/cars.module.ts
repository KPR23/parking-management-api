import { Module } from '@nestjs/common';
import { CarController } from './cars.controller.js';
import { CarService } from './cars.service.js';

@Module({
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarsModule {}
