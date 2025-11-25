import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Type of subscription',
    enum: SubscriptionType,
    example: SubscriptionType.monthly,
  })
  @IsEnum(SubscriptionType)
  @IsNotEmpty()
  type: SubscriptionType;

  @ApiProperty({
    description: 'Start date of subscription',
    example: '2023-01-01T00:00:00Z',
    required: false,
  })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'ID of the car', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  carId: number;
}
