import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsISO8601, IsOptional } from 'class-validator';
import { CreateSubscriptionDto } from './subscription-create.dto';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
  @ApiProperty({
    description: 'End date of subscription',
    example: '2023-02-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;
}
