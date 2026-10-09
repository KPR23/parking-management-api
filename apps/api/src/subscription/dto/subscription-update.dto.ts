import { PartialType } from '@nestjs/mapped-types';
import { IsISO8601, IsOptional } from 'class-validator';
import { CreateSubscriptionDto } from './subscription-create.dto.js';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @IsOptional()
  @IsISO8601()
  endDate?: string;
}
