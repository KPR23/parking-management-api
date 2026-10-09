import {
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { SubscriptionType } from '../../generated/prisma/client.js';

export class CreateSubscriptionDto {
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  type: SubscriptionType;

  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  carId: number;
}
