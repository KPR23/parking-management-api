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

  async getTicket(id: number): Promise<Ticket | null> {
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
          parkingLotId: parkingLot.id,
          entryTime: new Date(),
        },

        include: { car: true },
      });

      await this.updateParkingOccupancy(tx, parkingLot.id, true);
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

      // Subscription - No Charge
      if (car.subscription && car.subscription.endDate > new Date()) {
        const updatedTicket = await tx.ticket.update({
          where: { id: activeTicket.id },
          data: {
            exitTime,
            totalAmount: 0,
            isPaid: true,
          },
          include: { car: { include: { subscription: true } } },
        });

        if (parkingLot.occupiedSpots > 0) {
          await this.updateParkingOccupancy(tx, parkingLot.id, false);
        }

        return updatedTicket;
      }

      // No Subscription - Calculate parking fee
      const pricePerHour = parkingLot.pricePerHour ?? 5;
      const freeHoursPerDay = parkingLot.freeHoursPerDay ?? 2;

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const alreadyUsedFree = await tx.ticket.findFirst({
        where: {
          carId: car.id,
          entryTime: { gte: startOfToday },
          exitTime: { not: null },
          totalAmount: { equals: 0 },
        },
      });

      let totalAmount = 0;

      if (!alreadyUsedFree) {
        if (hours <= freeHoursPerDay) {
          totalAmount = 0;
        } else {
          const chargeableHours = Math.max(
            0,
            Math.ceil(hours - freeHoursPerDay),
          );
          totalAmount = chargeableHours * pricePerHour;
        }
      } else {
        const paidHours = Math.ceil(hours);
        totalAmount = paidHours * pricePerHour;
      }

      const updatedTicket = await tx.ticket.update({
        where: { id: activeTicket.id },
        data: {
          exitTime,
          totalAmount,
          isPaid: totalAmount === 0,
        },
        include: { car: true },
      });

      await this.updateParkingOccupancy(tx, parkingLot.id, false);

      return updatedTicket;
    });
  }
}
