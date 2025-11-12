import { SubscriptionType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  type: SubscriptionType;

  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @IsISO8601()
  @IsNotEmpty()
  endDate: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  carId: number;
}
