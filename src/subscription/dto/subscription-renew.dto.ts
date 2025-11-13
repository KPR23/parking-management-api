import { SubscriptionType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class RenewSubscriptionDto {
  @IsEnum(SubscriptionType)
  type: SubscriptionType;
}
