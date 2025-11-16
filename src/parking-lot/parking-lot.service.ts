import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParkingLot } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParkingLotDto } from './dto/parking-lot-create.dto';
import { UpdateParkingLotDto } from './dto/parking-lot-update.dto';

@Injectable()
export class ParkingLotService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateParkingLotDto): Promise<ParkingLot> {
    const existingLot = await this.prisma.parkingLot.findFirst({
      where: { name: data.name },
    });
    if (existingLot) {
      throw new BadRequestException(
        'Parking lot with this name already exists.',
      );
    }

    return this.prisma.parkingLot.create({
      data: {
        name: data.name,
        location: data.location,
        totalSpots: data.totalSpots,
        pricePerHour: data.pricePerHour ?? 5,
        freeHoursPerDay: data.freeHoursPerDay ?? 2,
        occupiedSpots: 0,
      },
    });
  }

  async getAll(): Promise<ParkingLot[]> {
    return this.prisma.parkingLot.findMany();
  }

  async getById(id: number): Promise<ParkingLot> {
    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id },
    });
    if (!parkingLot) throw new NotFoundException('Parking lot not found.');
    return parkingLot;
  }

  async update(id: number, data: UpdateParkingLotDto): Promise<ParkingLot> {
    try {
      return this.prisma.parkingLot.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException('Parking lot not found.');
    }
  }

  async delete(id: number): Promise<ParkingLot> {
    return this.prisma.$transaction(async (tx) => {
      await tx.ticket.deleteMany({ where: { parkingLotId: id } });
      return tx.parkingLot.delete({ where: { id } });
    });
  }
}
