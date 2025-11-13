import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParkingService {
  constructor(private readonly prisma: PrismaService) {}

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
    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id: parkingLotId },
    });
    if (!parkingLot) throw new NotFoundException('Parking lot not found.');

    const occupiedSpotsCount = await this.prisma.ticket.count({
      where: { parkingLotId, exitTime: null },
    });

    if (occupiedSpotsCount >= parkingLot.totalSpots) {
      throw new BadRequestException('Parking lot is full.');
    }

    let car = await this.prisma.car.findUnique({ where: { plateNumber } });
    if (!car) {
      car = await this.prisma.car.create({ data: { plateNumber } });
    }

    const activeTicket = await this.prisma.ticket.findFirst({
      where: { carId: car.id, exitTime: null },
    });

    if (activeTicket) {
      throw new BadRequestException({
        message: 'Car is already parked.',
        ticketId: activeTicket.id,
      });
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        carId: car.id,
        parkingLotId: parkingLot.id,
        entryTime: new Date(),
      },

      include: { car: true },
    });

    await this.prisma.parkingLot.update({
      where: { id: parkingLot.id },
      data: { occupiedSpots: { increment: 1 } },
    });

    return ticket;
  }

  async exit(plateNumber: string) {
    const car = await this.prisma.car.findUnique({
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

    const parkingLot = await this.prisma.parkingLot.findUnique({
      where: { id: activeTicket.parkingLotId },
    });
    if (!parkingLot) throw new NotFoundException('Parking lot not found.');

    const exitTime = new Date();
    const hours = Math.ceil(
      (exitTime.getTime() - activeTicket.entryTime.getTime()) / 3_600_000,
    );

    // Subscription
    if (car.subscription && car.subscription.endDate > new Date()) {
      const updatedTicket = await this.prisma.ticket.update({
        where: { id: activeTicket.id },
        data: {
          exitTime,
          totalAmount: 0,
          isPaid: true,
        },
        include: { car: true },
      });

      if (parkingLot.occupiedSpots > 0) {
        await this.prisma.parkingLot.update({
          where: { id: parkingLot.id },
          data: { occupiedSpots: { decrement: 1 } },
        });
      }

      return updatedTicket;
    }

    const pricePerHour = parkingLot.pricePerHour ?? 5;
    const freeHoursPerDay = parkingLot.freeHoursPerDay ?? 2;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyUsedFree = await this.prisma.ticket.findFirst({
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
        const chargeableHours = Math.ceil(hours - freeHoursPerDay);
        totalAmount = chargeableHours * pricePerHour;
      }
    } else {
      const paidHours = Math.ceil(hours);
      totalAmount = paidHours * pricePerHour;
    }

    const updatedTicket = await this.prisma.ticket.update({
      where: { id: activeTicket.id },
      data: {
        exitTime,
        totalAmount,
        isPaid: totalAmount === 0,
      },
      include: { car: true },
    });

    if (parkingLot.occupiedSpots > 0) {
      await this.prisma.parkingLot.update({
        where: { id: parkingLot.id },
        data: { occupiedSpots: { decrement: 1 } },
      });
    }

    return updatedTicket;
  }
}
