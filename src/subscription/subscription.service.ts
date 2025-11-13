import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/subscription-create.dto';
import { RenewSubscriptionDto } from './dto/subscription-renew.dto';
import { UpdateSubscriptionDto } from './dto/subscription-update.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptionById(id: number) {
    try {
      return this.prisma.subscription.findUniqueOrThrow({
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
      return this.prisma.subscription.findFirstOrThrow({
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
          `Car with plate number ${plateNumber} has not active subscription.`,
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

    if (car.subscription && car.subscription.endDate > new Date()) {
      throw new BadRequestException(
        `Car with ID ${data.carId} already has an active subscription until ${car.subscription.endDate.toISOString()}.`,
      );
    }

    if (car.subscription && car.subscription.endDate <= new Date()) {
      await this.prisma.subscription.delete({
        where: { id: car.subscription.id },
      });
    }

    const startDate = data.startDate ? new Date(data.startDate) : new Date();
    const endDate = new Date(startDate);

    switch (data.type) {
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      case 'lifetime':
        endDate.setFullYear(endDate.getFullYear() + 100);
        break;
      default:
        throw new BadRequestException(`Unknown subscription type`);
    }

    if (car.subscription && car.subscription.endDate > new Date()) {
      throw new BadRequestException('Car already has an active subscription.');
    }

    try {
      return this.prisma.subscription.create({
        data: {
          type: data.type,
          startDate,
          endDate,
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

  async renew(id: number, data: RenewSubscriptionDto): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription)
      throw new NotFoundException(`Subscription with ID ${id} not found.`);

    if (new Date(subscription.endDate) < new Date()) {
      throw new BadRequestException(`This subscription has already expired.`);
    }

    const newEndDate = new Date(subscription.endDate);
    const type = data.type ?? subscription.type;

    switch (type) {
      case 'monthly':
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        break;
      case 'yearly':
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        break;
      case 'lifetime':
        newEndDate.setFullYear(newEndDate.getFullYear() + 100);
        break;
      default:
        throw new BadRequestException(`Unknown subscription type`);
    }
    return this.prisma.subscription.update({
      where: { id },
      data: { endDate: newEndDate },
    });
  }

  async update(id: number, data: UpdateSubscriptionDto): Promise<Subscription> {
    return this.prisma.subscription
      .update({
        where: { id },
        data,
      })
      .catch(() => {
        throw new NotFoundException(`Subscription with ID ${id} not found.`);
      });
  }

  async delete(id: number): Promise<Subscription> {
    return this.prisma.subscription
      .delete({
        where: { id },
      })
      .catch(() => {
        throw new NotFoundException(`Subscription with ID ${id} not found.`);
      });
  }
}
