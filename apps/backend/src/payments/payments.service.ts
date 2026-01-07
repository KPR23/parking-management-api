import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ParkingExitResponse } from 'src/parking/dto/parking-exit-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketsService } from 'src/tickets/tickets.service';
import { QuoteReason, TicketQuoteDto } from './dto/payments-quote.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ticketsService: TicketsService,
  ) {}

  async calculateExitPrice(ticketId: number): Promise<TicketQuoteDto> {
    const ticket = await this.ticketsService.getTicket(ticketId);

    const now = new Date();

    // Subscription - free exit
    const subscription = ticket.car.subscription;
    const activeSubscription = subscription && subscription.endDate > now;

    const entryTime = ticket.entryTime;
    const exitTime = now;

    const hours = Math.ceil(
      (exitTime.getTime() - entryTime.getTime()) / 3_600_000,
    );

    if (activeSubscription) {
      return {
        ticketId,
        totalAmount: 0,
        parkingDurationHours: hours,
        usedDailyFree: false,
        reason: QuoteReason.SUBSCRIPTION,
        calculatedAt: now,
        canExit: true,
      };
    }

    // Calculate parking duration
    const parkingLot = ticket.parkingLot;
    const pricePerHour = parkingLot.pricePerHour ?? 5;
    const freeHoursPerDay = parkingLot.freeHoursPerDay ?? 2;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadyUsedFree = await this.prisma.ticket.findFirst({
      where: {
        carId: ticket.carId,
        entryTime: { gte: startOfToday },
        usedDailyFree: true,
        id: { not: ticketId },
      },
    });

    let totalAmount = 0;
    let usedDailyFree = false;
    let reason = QuoteReason.NORMAL_RATE;

    if (!alreadyUsedFree) {
      if (hours <= freeHoursPerDay) {
        totalAmount = 0;
        usedDailyFree = true;
        reason = QuoteReason.DAILY_FREE;
      } else {
        const billableHours = hours - freeHoursPerDay;
        totalAmount = billableHours * pricePerHour;
        usedDailyFree = true;
        reason = QuoteReason.NORMAL_RATE;
      }
    } else {
      totalAmount = hours * pricePerHour;
      usedDailyFree = false;
      reason = QuoteReason.NORMAL_RATE;
    }

    return {
      ticketId,
      totalAmount,
      parkingDurationHours: hours,
      usedDailyFree,
      reason,
      calculatedAt: now,
      canExit: totalAmount === 0,
    };
  }

  async pay(
    ticketId: number,
    tx?: Prisma.TransactionClient,
  ): Promise<ParkingExitResponse> {
    const client = tx || this.prisma;
    const quote = await this.calculateExitPrice(ticketId);

    const currentTicket = await client.ticket.findUnique({
      where: { id: ticketId },
      include: {
        car: {
          include: { subscription: true },
        },
        parkingLot: true,
      },
    });

    if (currentTicket?.exitTime) {
      throw new BadRequestException('Ticket is already closed (car left).');
    }

    if (
      currentTicket?.isPaid &&
      currentTicket.totalAmount === quote.totalAmount
    ) {
      return {
        ...currentTicket,
        reason: quote.reason,
        calculatedAt: quote.calculatedAt,
      };
    }

    const updatedTicket = await client.ticket.update({
      where: { id: ticketId },
      data: {
        totalAmount: quote.totalAmount,
        // Simulating automatic payment from registered card
        isPaid: true,
        usedDailyFree: quote.usedDailyFree,
        paidAt: new Date(),
      },
      include: {
        car: {
          include: { subscription: true },
        },
        parkingLot: true,
      },
    });

    return {
      ...updatedTicket,
      reason: quote.reason,
      calculatedAt: quote.calculatedAt,
    };
  }
}
