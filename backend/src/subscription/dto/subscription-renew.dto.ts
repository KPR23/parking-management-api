import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class RenewSubscriptionDto {
  @ApiProperty({
    description: 'Type of subscription to renew to',
    enum: SubscriptionType,
    example: SubscriptionType.monthly,
  })
  @IsEnum(SubscriptionType)
  type: SubscriptionType;
}
