import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/subscription-create.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscription(
    @Query('id') id?: string,
    @Query('plateNumber') plateNumber?: string,
  ) {
    if (id) {
      return this.subscriptionService.getSubscriptionById(Number(id));
    }

    if (plateNumber) {
      return this.subscriptionService.getSubscriptionByPlateNumber(plateNumber);
    }

    throw new BadRequestException(
      'Please provide either "id" or "plateNumber" as a query parameter.',
    );
  }

  @Post()
  create(@Body() data: CreateSubscriptionDto) {
    return this.subscriptionService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `This action updates a subscription with ID ${id}`;
  }
}
