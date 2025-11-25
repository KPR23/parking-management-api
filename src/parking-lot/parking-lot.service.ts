import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GateType, ParkingLot } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateParkingLotDto } from './dto/parking-lot-create.dto';
import { UpdateParkingLotDto } from './dto/parking-lot-update.dto';

@Injectable()
export class ParkingLotService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<ParkingLot[]> {
    const parkingLots = await this.prisma.parkingLot.findMany({
      include: {
        gates: true,
      },
    });

    if (!parkingLots) throw new NotFoundException('No parking lots found.');

    return parkingLots;
  }

  async getById(id: number): Promise<ParkingLot> {
    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id },
      include: {
        gates: true,
      },
    });

    if (!parkingLot) throw new NotFoundException('Parking lot not found.');

    return parkingLot;
  }

  async create(data: CreateParkingLotDto): Promise<ParkingLot> {
    return await this.prisma.$transaction(async (tx) => {
      const existingLot = await tx.parkingLot.findFirst({
        where: { name: data.name },
      });

      if (existingLot) {
        throw new BadRequestException(
          'Parking lot with this name already exists.',
        );
      }

      const lot = await tx.parkingLot.create({
        data: {
          name: data.name,
          location: data.location,
          totalSpots: data.totalSpots,
          pricePerHour: data.pricePerHour,
          freeHoursPerDay: data.freeHoursPerDay,
          occupiedSpots: 0,
        },
      });

      await tx.gate.create({
        data: {
          deviceId: randomUUID(),
          type: GateType.ENTRY,
          parkingLotId: lot.id,
        },
      });

      await tx.gate.create({
        data: {
          deviceId: randomUUID(),
          type: GateType.EXIT,
          parkingLotId: lot.id,
        },
      });

      return lot;
    });
  }

  async update(id: number, data: UpdateParkingLotDto): Promise<ParkingLot> {
    return await this.prisma.parkingLot.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<ParkingLot> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.ticket.deleteMany({ where: { parkingLotId: id } });

      return tx.parkingLot.delete({
        where: { id },
      });
    });
  }
}
