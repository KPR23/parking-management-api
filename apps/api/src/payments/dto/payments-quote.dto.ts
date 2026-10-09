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
  @IsInt()
  @Min(1)
  readonly ticketId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly totalAmount: number;

  @IsNumber()
  @Min(0)
  readonly parkingDurationHours: number;

  @IsBoolean()
  readonly usedDailyFree: boolean;

  @IsEnum(QuoteReason)
  readonly reason: QuoteReason;

  @IsDate()
  @Type(() => Date)
  readonly calculatedAt: Date;

  @IsBoolean()
  readonly canExit: boolean;
}
