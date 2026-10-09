import { IsEnum } from 'class-validator';
import { SubscriptionType } from '../../generated/prisma/client.js';

export class RenewSubscriptionDto {
  @IsEnum(SubscriptionType)
  type: SubscriptionType;
}
