import { Module } from '@nestjs/common';
import { CarController } from './cars.controller';
import { CarService } from './cars.service';

@Module({
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarsModule {}
