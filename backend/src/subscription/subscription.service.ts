import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/subscription-create.dto';
import { RenewSubscriptionDto } from './dto/subscription-renew.dto';
import { UpdateSubscriptionDto } from './dto/subscription-update.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptionById(id: number): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found.`);
    }

    return subscription;
  }

  async getSubscriptionByPlateNumber(
    plateNumber: string,
  ): Promise<Subscription> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        car: { plateNumber },
        endDate: { gt: new Date() },
      },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Car with plate number ${plateNumber} has no active subscription.`,
      );
    }

    return subscription;
  }

  async create(data: CreateSubscriptionDto): Promise<Subscription> {
    return await this.prisma.$transaction(async (tx) => {
      const car = await tx.car.findUnique({
        where: { id: data.carId },
        include: { subscription: true },
      });

      if (!car) {
        throw new BadRequestException(
          'Car not found. Cannot create subscription.',
        );
      }

      const now = new Date();

      if (car.subscription && car.subscription.endDate > now) {
        throw new BadRequestException(
          `Car with ID ${data.carId} already has an active subscription until ${car.subscription.endDate.toISOString()}.`,
        );
      }

      if (car.subscription && car.subscription.endDate <= now) {
        await tx.subscription.delete({
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

      return tx.subscription.create({
        data: {
          type: data.type,
          startDate,
          endDate,
          car: { connect: { id: data.carId } },
        },
      });
    });
  }

  async renew(id: number, data: RenewSubscriptionDto): Promise<Subscription> {
    return await this.prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.findUnique({
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
      return tx.subscription.update({
        where: { id },
        data: { endDate: newEndDate, type },
      });
    });
  }

  async update(id: number, data: UpdateSubscriptionDto): Promise<Subscription> {
    return await this.prisma.$transaction(async (tx) => {
      const existing = await tx.subscription.findUnique({ where: { id } });
      if (!existing)
        throw new NotFoundException(`Subscription with ID ${id} not found.`);

      const startDate = data.startDate ?? existing.startDate;
      const endDate = data.endDate ?? existing.endDate;

      if (endDate < startDate) {
        throw new BadRequestException(
          'End date cannot be earlier than start date.',
        );
      }

      return tx.subscription.update({ where: { id }, data });
    });
  }

  async delete(id: number): Promise<Subscription> {
    return await this.prisma.subscription.delete({
      where: { id },
    });
  }
}
