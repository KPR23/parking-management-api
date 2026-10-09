import { Injectable, NotFoundException } from '@nestjs/common';
import { Car, Prisma, Subscription } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CarService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPlate(
    plateNumber: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Car> {
    const client = tx || this.prisma;

    const car = await client.car.findUnique({
      where: { plateNumber },
      include: {
        subscription: true,
      },
    });

    if (!car) {
      throw new NotFoundException(
        `Car with plate number ${plateNumber} not found.`,
      );
    }

    return car;
  }

  async findById(id: number, tx?: Prisma.TransactionClient): Promise<Car> {
    const client = tx || this.prisma;

    const car = await client.car.findUnique({
      where: { id },
      include: {
        subscription: true,
      },
    });

    if (!car) {
      throw new NotFoundException(`Car with id ${id} not found.`);
    }

    return car;
  }

  async findOrCreate(
    plateNumber: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Car> {
    const client = tx || this.prisma;

    return await client.car.upsert({
      where: {
        plateNumber,
      },
      include: {
        subscription: true,
      },
      update: {},
      create: { plateNumber },
    });
  }

  async findWithActiveTicket(
    plateNumber: string,
    tx?: Prisma.TransactionClient,
  ): Promise<
    Car & {
      tickets: { id: number; entryTime: Date; parkingLotId: number }[];
      subscription: Subscription | null;
    }
  > {
    const client = tx || this.prisma;

    const car = await client.car.findUnique({
      where: { plateNumber },
      include: {
        tickets: {
          where: { exitTime: null },
          select: { id: true, entryTime: true, parkingLotId: true },
        },
        subscription: true,
      },
    });

    if (!car) {
      throw new NotFoundException(
        `Car with plate number ${plateNumber} not found.`,
      );
    }

    return car;
  }
}
