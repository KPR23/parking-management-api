import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Ticket } from '@prisma/client';
import { CarService } from 'src/cars/cars.service';
import { ParkingLotService } from 'src/parking-lot/parking-lot.service';
import { QuoteReason } from 'src/payments/dto/payments-quote.dto';
import { PaymentsService } from 'src/payments/payments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketsService } from 'src/tickets/tickets.service';

@Injectable()
export class ParkingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parkingLotService: ParkingLotService,
    private readonly carService: CarService,
    private readonly ticketsService: TicketsService,
    private readonly paymentsService: PaymentsService,
  ) {}

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

  async getTicket(id: number) {
    return this.ticketsService.getTicket(id);
  }

  async getActiveTicketByPlate(plateNumber: string): Promise<Ticket> {
    return this.ticketsService.getActiveTicketByPlate(plateNumber);
  }

  async entryWithTx(
    tx: Prisma.TransactionClient,
    parkingLotId: number,
    plateNumber: string,
  ) {
    const parkingLot = await tx.parkingLot.findUnique({
      where: { id: parkingLotId },
    });

    if (!parkingLot) throw new NotFoundException('Parking lot not found.');

    const occupiedSpotsCount = await this.ticketsService.countOccupiedSpots(
      tx,
      parkingLotId,
    );

    if (occupiedSpotsCount >= parkingLot.totalSpots) {
      throw new BadRequestException('Parking lot is full.');
    }

    const car = await this.carService.findOrCreate(plateNumber, tx);

    const activeTicket = await this.ticketsService.findActiveByCarId(
      tx,
      car.id,
    );

    if (activeTicket) {
      throw new BadRequestException({
        message: 'Car is already parked.',
        ticketId: activeTicket.id,
      });
    }

    const ticket = await this.ticketsService.create(tx, {
      carId: car.id,
      parkingLotId,
      entryTime: new Date(),
    });

    await this.updateParkingOccupancy(tx, parkingLotId, true);

    return ticket;
  }

  async exitWithTx(
    tx: Prisma.TransactionClient,
    plateNumber: string,
  ): Promise<
    Prisma.TicketGetPayload<{
      include: { car: { include: { subscription: true } }; parkingLot: true };
    }> & { reason: QuoteReason; calculatedAt: Date }
  > {
    const car = await this.carService.findWithActiveTicket(plateNumber, tx);

    const activeTicket = car.tickets[0];
    if (!activeTicket)
      throw new BadRequestException('No active ticket for this car.');

    const parkingLot = await this.parkingLotService.getById(
      activeTicket.parkingLotId,
    );

    const paidTicket = await this.paymentsService.pay(activeTicket.id, tx);

    const exitedTicket = await tx.ticket.update({
      where: { id: activeTicket.id },
      data: { exitTime: new Date() },
      include: {
        car: { include: { subscription: true } },
        parkingLot: true,
      },
    });

    return {
      ...exitedTicket,
      reason: paidTicket.reason,
      calculatedAt: paidTicket.calculatedAt,
    };
  }

  async entry(parkingLotId: number, plateNumber: string) {
    return this.prisma.$transaction((tx) =>
      this.entryWithTx(tx, parkingLotId, plateNumber),
    );
  }

  async exit(plateNumber: string): Promise<
    Prisma.TicketGetPayload<{
      include: { car: { include: { subscription: true } }; parkingLot: true };
    }> & { reason: QuoteReason; calculatedAt: Date }
  > {
    return this.prisma.$transaction((tx) => this.exitWithTx(tx, plateNumber));
  }
}
