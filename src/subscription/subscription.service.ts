import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/subscription-create.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptionById(id: number) {
    try {
      return await this.prisma.subscription.findUniqueOrThrow({
        where: { id },
        include: {
          car: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Subscription with ID ${id} not found.`);
      }
      throw error;
    }
  }

  async getSubscriptionByPlateNumber(plateNumber: string) {
    try {
      return await this.prisma.subscription.findFirstOrThrow({
        where: {
          car: {
            plateNumber: plateNumber,
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Subscription with plate number ${plateNumber} not found.`,
        );
      }
      throw error;
    }
  }

  async create(data: CreateSubscriptionDto): Promise<Subscription> {
    const car = await this.prisma.car.findUnique({
      where: { id: data.carId },
      include: { subscription: true },
    });

    if (!car) {
      throw new BadRequestException(
        'Car not found. Cannot create subscription.',
      );
    }

    if (car.subscription) {
      throw new BadRequestException(
        `Car with ID ${data.carId} already has an active subscription.`,
      );
    }

    try {
      return await this.prisma.subscription.create({
        data: {
          type: data.type,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          endDate: new Date(data.endDate),
          car: { connect: { id: data.carId } },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          `Car with ID ${data.carId} already has an active subscription.`,
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Car not found. Cannot create subscription.',
        );
      }

      throw error;
    }
  }
}
