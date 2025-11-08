import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParkingService {
  private readonly pricePerHour = 5;
  private readonly freeHoursPerDay = 2;

  constructor(private readonly prisma: PrismaService) {}

  async createEntry(plateNumber: string) {
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
      data: { carId: car.id, entryTime: new Date() },
      include: { car: true },
    });

    return ticket;
  }

  async createExit(plateNumber: string) {
    const car = await this.prisma.car.findUnique({
      where: { plateNumber },
      include: { tickets: { where: { exitTime: null } } },
    });

    if (!car) throw new NotFoundException('Car not found.');
    const activeTicket = car.tickets[0];
    if (!activeTicket)
      throw new BadRequestException('No active ticket for this car.');

    const exitTime = new Date();
    const diffMs = exitTime.getTime() - activeTicket.entryTime.getTime();
    const hours = diffMs / (1000 * 60 * 60);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyUsedFree = await this.prisma.ticket.findFirst({
      where: {
        carId: car.id,
        entryTime: { gte: startOfToday },
        totalAmount: { not: null },
      },
    });

    let totalAmount = 0;

    if (!alreadyUsedFree) {
      if (hours <= this.freeHoursPerDay) {
        totalAmount = 0;
      } else {
        const chargeableHours = Math.ceil(hours - this.freeHoursPerDay);
        totalAmount = chargeableHours * this.pricePerHour;
      }
    } else {
      const paidHours = Math.ceil(hours);
      totalAmount = paidHours * this.pricePerHour;
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

    return updatedTicket;
  }

  async getTicket(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { car: true },
    });

    if (!ticket) throw new NotFoundException('Ticket not found.');

    return ticket;
  }
}
