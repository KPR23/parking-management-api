import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Subscription } from '@prisma/client';
import { CreateSubscriptionDto } from './dto/subscription-create.dto';
import { RenewSubscriptionDto } from './dto/subscription-renew.dto';
import { UpdateSubscriptionDto } from './dto/subscription-update.dto';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscription(
    @Query('id') id?: string,
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
    @Param('id') id: number,
    @Body() data: RenewSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.renew(Number(id), data);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() data: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<Subscription> {
    return this.subscriptionService.delete(Number(id));
  }
}
