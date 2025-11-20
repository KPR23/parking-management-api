import { BadRequestException, Injectable } from '@nestjs/common';
import { ParkingService } from 'src/parking/parking.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketPayDto } from './dto/payments-pay.dto';
import { QuoteReason, TicketQuoteDto } from './dto/payments-quote.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parkingService: ParkingService,
  ) {}

  async calculateExitPrice(ticketId: number): Promise<TicketQuoteDto> {
    const ticket = await this.parkingService.getTicket(ticketId);

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

  async pay(ticketId: number): Promise<TicketPayDto> {
    const quote = await this.calculateExitPrice(ticketId);

    const currentTicket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (currentTicket?.exitTime) {
      throw new BadRequestException('Ticket is already closed (car left).');
    }

    if (
      currentTicket?.isPaid &&
      currentTicket.totalAmount === quote.totalAmount
    ) {
      return {
        ticketId,
        totalAmount: quote.totalAmount,
        usedDailyFree: quote.usedDailyFree,
        reason: quote.reason,
        calculatedAt: currentTicket.paidAt || new Date(),
      };
    }

    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        totalAmount: quote.totalAmount,
        isPaid: true,
        usedDailyFree: quote.usedDailyFree,
        paidAt: new Date(),
      },
    });

    return {
      ticketId: ticketId,
      totalAmount: quote.totalAmount ?? 0,
      usedDailyFree: quote.usedDailyFree,
      reason: quote.reason,
      calculatedAt: quote.calculatedAt,
    };
  }
}
