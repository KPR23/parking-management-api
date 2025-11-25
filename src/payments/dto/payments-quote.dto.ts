import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';

export enum QuoteReason {
  SUBSCRIPTION = 'SUBSCRIPTION',
  DAILY_FREE = 'DAILY_FREE',
  NORMAL_RATE = 'NORMAL_RATE',
}

export class TicketQuoteDto {
  @ApiProperty({ description: 'The ID of the ticket', example: 1 })
  @IsInt()
  @Min(1)
  readonly ticketId: number;

  @ApiProperty({ description: 'Total amount to pay', example: 10.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly totalAmount: number;

  @ApiProperty({ description: 'Duration of parking in hours', example: 2.5 })
  @IsNumber()
  @Min(0)
  readonly parkingDurationHours: number;

  @ApiProperty({
    description: 'Whether daily free hours were used on this ticket',
    example: false,
  })
  @IsBoolean()
  readonly usedDailyFree: boolean;

  @ApiProperty({
    description: 'Reason for the quote',
    enum: QuoteReason,
    example: QuoteReason.NORMAL_RATE,
  })
  @IsEnum(QuoteReason)
  readonly reason: QuoteReason;

  @ApiProperty({
    description: 'Calculation timestamp',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  @Type(() => Date)
  readonly calculatedAt: Date;

  @ApiProperty({
    description: 'Whether the car can exit (e.g. if paid or free)',
    example: true,
  })
  @IsBoolean()
  readonly canExit: boolean;
}
