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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Subscription } from '@prisma/client';
import { CreateSubscriptionDto } from './dto/subscription-create.dto';
import { RenewSubscriptionDto } from './dto/subscription-renew.dto';
import { UpdateSubscriptionDto } from './dto/subscription-update.dto';
import { SubscriptionService } from './subscription.service';

@ApiTags('Subscriptions')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @ApiOperation({ summary: 'Get subscription by ID or plate number' })
  @ApiResponse({ status: 200, description: 'Return the subscription.' })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({
    status: 201,
    description: 'The subscription has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() data: CreateSubscriptionDto): Promise<Subscription> {
    return this.subscriptionService.create(data);
  }

  @Patch(':id/renew')
  @ApiOperation({ summary: 'Renew a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully renewed.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  renew(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: RenewSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.renew(id, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    return this.subscriptionService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subscription' })
  @ApiResponse({
    status: 200,
    description: 'The subscription has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found.' })
  delete(@Param('id', ParseIntPipe) id: number): Promise<Subscription> {
    return this.subscriptionService.delete(id);
  }
}
