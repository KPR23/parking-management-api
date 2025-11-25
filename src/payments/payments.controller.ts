import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TicketPayDto } from './dto/payments-pay.dto';
import { TicketQuoteDto } from './dto/payments-quote.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('tickets/:ticketId/quote')
  @ApiOperation({ summary: 'Calculate exit price' })
  @ApiResponse({ status: 200, description: 'Return the price quote.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  calculateExitPrice(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<TicketQuoteDto> {
    return this.paymentsService.calculateExitPrice(ticketId);
  }

  @Post('tickets/:ticketId/pay')
  @ApiOperation({ summary: 'Process payment' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully.' })
  @ApiResponse({ status: 404, description: 'Ticket not found.' })
  async processPayment(
    @Param('ticketId', ParseIntPipe) ticketId: number,
  ): Promise<TicketPayDto> {
    const result = await this.paymentsService.pay(ticketId);
    return {
      ticketId: result.id,
      totalAmount: result.totalAmount ?? 0,
      usedDailyFree: result.usedDailyFree,
      reason: result.reason,
      calculatedAt: result.calculatedAt,
    };
  }
}
