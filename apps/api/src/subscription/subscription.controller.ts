import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Subscription } from '../generated/prisma/client.js';
import { CreateSubscriptionDto } from './dto/subscription-create.dto.js';
import { RenewSubscriptionDto } from './dto/subscription-renew.dto.js';
import { UpdateSubscriptionDto } from './dto/subscription-update.dto.js';
import { SubscriptionService } from './subscription.service.js';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscription(
    @Query('id') id?: number,
    @Query('plateNumber') plateNumber?: string,
  ): Promise<Subscription> {
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
  create(@Body() data: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.create(data);
  }

  @Patch(':id/renew')
  renew(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RenewSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.renew(id, data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<Subscription> {
    return this.subscriptionService.delete(id);
  }
}
