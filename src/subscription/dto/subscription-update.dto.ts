import { SubscriptionType } from '@prisma/client';
import { IsEnum, IsInt, IsISO8601, IsOptional, Min } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsEnum(SubscriptionType)
  type: SubscriptionType;

  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  carId: number;
}
