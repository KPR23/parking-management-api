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

  async getAll(): Promise<ParkingLot[]> {
    const parkingLots = await this.prisma.parkingLot.findMany();

    if (!parkingLots) throw new NotFoundException('No parking lots found.');

    return parkingLots;
  }

  async getById(id: number): Promise<ParkingLot> {
    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id },
    });

    if (!parkingLot) throw new NotFoundException('Parking lot not found.');

    return parkingLot;
  }

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
        pricePerHour: data.pricePerHour,
        freeHoursPerDay: data.freeHoursPerDay,
        occupiedSpots: 0,
      },
    });
  }

  async update(id: number, data: UpdateParkingLotDto): Promise<ParkingLot> {
    return this.prisma.parkingLot.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<ParkingLot> {
    return this.prisma.$transaction(async (tx) => {
      await tx.ticket.deleteMany({ where: { parkingLotId: id } });

      return tx.parkingLot.delete({
        where: { id },
      });
    });
  }
}
