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
  @IsInt()
  @Min(1)
  readonly ticketId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  readonly totalAmount: number;

  @IsBoolean()
  @IsOptional()
  readonly usedDailyFree?: boolean;

  @IsEnum(QuoteReason)
  readonly reason: QuoteReason;

  @IsDate()
  @Type(() => Date)
  readonly calculatedAt: Date;
}
