import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParkingService {
  private readonly pricePerHour = 5;

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
      throw new BadRequestException('Car is already parked.');
    }

    const ticket = await this.prisma.ticket.create({
      data: { carId: car.id, entryTime: new Date() },
      include: { car: true },
    });

    return ticket;
  }

  async createExit(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

    if (ticket.exitTime) {
      throw new BadRequestException('Car has already left.');
    }

    const exitTime = new Date();
    const diffMs = exitTime.getTime() - ticket.entryTime.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    const totalAmount = hours * this.pricePerHour;

    const updatedTicket = await this.prisma.ticket.update({
      where: { id },
      data: { exitTime, totalAmount },
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
