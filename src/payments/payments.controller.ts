import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TicketPayDto } from './dto/payments-pay.dto';
import { TicketQuoteDto } from './dto/payments-quote.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('tickets/:ticketId/quote')
  calculateExitPrice(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<TicketQuoteDto> {
    return this.paymentsService.calculateExitPrice(ticketId);
  }

  @Post('tickets/:ticketId/pay')
  processPayment(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<TicketPayDto> {
    return this.paymentsService.pay(ticketId);
  }
}
