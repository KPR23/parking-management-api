import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export enum QuoteReason {
  SUBSCRIPTION = 'SUBSCRIPTION',
  DAILY_FREE = 'DAILY_FREE',
  NORMAL_RATE = 'NORMAL_RATE',
}

export class TicketPayDto {
  @ApiProperty({ description: 'The ID of the ticket', example: 1 })
  @IsInt()
  @Min(1)
  readonly ticketId: number;

  @ApiProperty({ description: 'Total amount paid', example: 10.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly totalAmount: number;

  @ApiProperty({
    description: 'Whether daily free hours were used on this ticket',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  readonly usedDailyFree?: boolean;

  @ApiProperty({
    description: 'Reason for the payment',
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
}
