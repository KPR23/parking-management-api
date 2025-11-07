import { Module } from '@nestjs/common';
import { ParkingController } from './parking/parking.controller';
import { ParkingService } from './parking/parking.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ParkingController],
  providers: [ParkingService, PrismaService],
})
export class AppModule {}
