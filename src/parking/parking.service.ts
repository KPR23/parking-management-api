import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParkingService {
  constructor(private readonly prisma: PrismaService) {}

  private updateParkingOccupancy(
    tx: Prisma.TransactionClient,
    parkingLotId: number,
    increment: boolean,
  ) {
    return tx.parkingLot.update({
      where: { id: parkingLotId },
      data: { occupiedSpots: { [increment ? 'increment' : 'decrement']: 1 } },
    });
  }

  async getTicket(id: number): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { car: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found.');

    return ticket;
  }

  async getActiveTicketByPlate(plateNumber: string): Promise<Ticket> {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        car: { plateNumber },
        exitTime: null,
      },
      include: { car: true },
    });

    if (!ticket)
      throw new NotFoundException(
        `No active ticket found for car with plate number ${plateNumber}`,
      );

    return ticket;
  }

  async entry(parkingLotId: number, plateNumber: string) {
    return this.prisma.$transaction(async (tx) => {
      const parkingLot = await tx.parkingLot.findUnique({
        where: { id: parkingLotId },
      });
      if (!parkingLot) throw new NotFoundException('Parking lot not found.');

      const occupiedSpotsCount = await tx.ticket.count({
        where: { parkingLotId, exitTime: null },
      });

      if (occupiedSpotsCount >= parkingLot.totalSpots) {
        throw new BadRequestException('Parking lot is full.');
      }

      let car = await tx.car.findUnique({ where: { plateNumber } });
      if (!car) {
        car = await tx.car.create({ data: { plateNumber } });
      }

      const activeTicket = await tx.ticket.findFirst({
        where: { carId: car.id, exitTime: null },
      });

      if (activeTicket) {
        throw new BadRequestException({
          message: 'Car is already parked.',
          ticketId: activeTicket.id,
        });
      }

      const ticket = await tx.ticket.create({
        data: {
          carId: car.id,
          parkingLotId,
          entryTime: new Date(),
        },
        include: { car: true },
      });

      await this.updateParkingOccupancy(tx, parkingLotId, true);

      return ticket;
    });
  }

  async exit(plateNumber: string) {
    return this.prisma.$transaction(async (tx) => {
      const car = await tx.car.findUnique({
        where: { plateNumber },
        include: {
          tickets: {
            where: { exitTime: null },
            select: { id: true, entryTime: true, parkingLotId: true },
          },
          subscription: true,
        },
      });

      if (!car) throw new NotFoundException('Car not found.');

      const activeTicket = car.tickets[0];
      if (!activeTicket)
        throw new BadRequestException('No active ticket for this car.');

      const parkingLot = await tx.parkingLot.findUnique({
        where: { id: activeTicket.parkingLotId },
      });
      if (!parkingLot) throw new NotFoundException('Parking lot not found.');

      const exitTime = new Date();
      const hours = Math.ceil(
        (exitTime.getTime() - activeTicket.entryTime.getTime()) / 3_600_000,
      );

      // Subscription = free exit
      if (car.subscription && car.subscription.endDate > new Date()) {
        const updated = await tx.ticket.update({
          where: { id: activeTicket.id },
          data: { exitTime, totalAmount: 0, isPaid: true },
        });

        // Fetch full ticket with subscription
        const full = await tx.ticket.findUniqueOrThrow({
          where: { id: updated.id },
          include: {
            car: {
              include: { subscription: true },
            },
          },
        });

        await this.updateParkingOccupancy(tx, parkingLot.id, false);
        return full;
      }

      // No subscription → calculate fee
      const pricePerHour = parkingLot.pricePerHour ?? 5;
      const freeHoursPerDay = parkingLot.freeHoursPerDay ?? 2;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const alreadyUsedFree = await tx.ticket.findFirst({
        where: {
          carId: car.id,
          entryTime: { gte: startOfToday },
          exitTime: { not: null },
          totalAmount: 0,
        },
      });

      let totalAmount = 0;

      if (!alreadyUsedFree) {
        if (hours > freeHoursPerDay) {
          totalAmount = Math.ceil(hours - freeHoursPerDay) * pricePerHour;
        }
      } else {
        totalAmount = Math.ceil(hours) * pricePerHour;
      }

      const updated = await tx.ticket.update({
        where: { id: activeTicket.id },
        data: {
          exitTime,
          totalAmount,
          isPaid: totalAmount === 0,
        },
      });

      const full = await tx.ticket.findUniqueOrThrow({
        where: { id: updated.id },
        include: {
          car: {
            include: { subscription: true },
          },
        },
      });

      await this.updateParkingOccupancy(tx, parkingLot.id, false);
      return full;
    });
  }
}
