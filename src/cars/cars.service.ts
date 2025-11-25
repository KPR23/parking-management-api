import { Injectable, NotFoundException } from '@nestjs/common';
import { Car, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

    return client.car.upsert({
      where: { plateNumber },
      update: {},
      create: { plateNumber },
    });
  }
}
