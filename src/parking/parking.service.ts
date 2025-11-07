import { Injectable } from '@nestjs/common';

@Injectable()
export class ParkingService {
  private tickets: Ticket[] = [];
  private freeHours = 2;
  private pricePerHour = 5;

  createEntry(plateNumber: string): Ticket {
    const carId = this.tickets.length + 1;
    if (this.tickets.some((t) => t.carId === carId && !t.exitTime)) {
      throw new Error('This car is already parked');
    }
  }

  createExit(id: number): Ticket | string {
    const ticket = this.tickets.find((t) => t.id === id);
    if (!ticket) return 'Ticket not found';

    ticket.exitTime = new Date();
    const diffMs = ticket.exitTime.getTime() - ticket.entryTime.getTime();
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    ticket.totalAmount = hours * this.pricePerHour;

    return ticket;
  }

  getTicket(id: number): Ticket | string {
    const ticket = this.tickets.find((t) => t.id === id);
    return ticket ?? 'Ticket not found';
  }
}
