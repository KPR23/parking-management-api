import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTicket(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        car: {
          include: {
            subscription: true,
          },
        },
        parkingLot: true,
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found.');
    }

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

  async countOccupiedSpots(
    tx: Prisma.TransactionClient,
    parkingLotId: number,
  ): Promise<number> {
    return await tx.ticket.count({
      where: { parkingLotId, exitTime: null },
    });
  }

  async findActiveByCarId(
    tx: Prisma.TransactionClient,
    carId: number,
  ): Promise<Ticket | null> {
    return await tx.ticket.findFirst({
      where: { carId, exitTime: null },
    });
  }

  async create(
    tx: Prisma.TransactionClient,
    data: Prisma.TicketUncheckedCreateInput,
  ) {
    return await tx.ticket.create({
      data,
      include: { car: true },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    id: number,
    data: Prisma.TicketUpdateInput,
  ) {
    return await tx.ticket.update({
      where: { id },
      data,
    });
  }

  async findUniqueOrThrow(
    tx: Prisma.TransactionClient,
    args: Prisma.TicketFindUniqueOrThrowArgs,
  ) {
    return await tx.ticket.findUniqueOrThrow(args);
  }

  async findFirst(
    tx: Prisma.TransactionClient,
    args: Prisma.TicketFindFirstArgs,
  ) {
    return await tx.ticket.findFirst(args);
  }
}
