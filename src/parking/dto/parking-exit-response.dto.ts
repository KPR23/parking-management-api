import { ApiProperty } from '@nestjs/swagger';
import { QuoteReason } from 'src/payments/dto/payments-pay.dto';

export class ParkingExitResponse {
  @ApiProperty({ description: 'The ID of the ticket', example: 1 })
  id: number;

  @ApiProperty({ description: 'Entry time', example: '2023-01-01T10:00:00Z' })
  entryTime: Date;

  @ApiProperty({
    description: 'Exit time',
    example: '2023-01-01T12:00:00Z',
    nullable: true,
  })
  exitTime: Date | null;

  @ApiProperty({
    description: 'Total amount to pay',
    example: 10.5,
    nullable: true,
  })
  totalAmount: number | null;

  @ApiProperty({ description: 'Payment status', example: false })
  isPaid: boolean;

  @ApiProperty({ description: 'Used daily free hours', example: false })
  usedDailyFree: boolean;

  @ApiProperty({ description: 'Parking lot ID', example: 1 })
  parkingLotId: number;

  @ApiProperty({
    description: 'Car details',
    example: {
      id: 1,
      plateNumber: 'WB12345',
      subscription: null,
    },
  })
  car: {
    id: number;
    plateNumber: string;
    subscription: {
      id: number;
      carId: number;
      type: string;
      startDate: Date;
      endDate: Date;
    } | null;
  };

  @ApiProperty({
    description: 'Parking lot details',
    example: {
      id: 1,
      name: 'Central Parking',
      location: 'Main St',
      totalSpots: 100,
      occupiedSpots: 50,
      pricePerHour: 5,
      freeHoursPerDay: 2,
    },
  })
  parkingLot: {
    id: number;
    name: string;
    location: string | null;
    totalSpots: number;
    occupiedSpots: number;
    pricePerHour: number | null;
    freeHoursPerDay: number | null;
  };

  @ApiProperty({
    description: 'Reason for the quote',
    enum: QuoteReason,
    example: QuoteReason.NORMAL_RATE,
  })
  reason: QuoteReason;

  @ApiProperty({
    description: 'Calculation timestamp',
    example: '2023-01-01T12:00:00Z',
  })
  calculatedAt: Date;
}
