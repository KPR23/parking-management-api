import { QuoteReason } from 'src/payments/dto/payments-pay.dto';

export interface ParkingExitResult {
  id: number;
  entryTime: Date;
  exitTime: Date | null;
  totalAmount: number | null;
  isPaid: boolean;
  usedDailyFree: boolean;
  parkingLotId: number;
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
  parkingLot: {
    id: number;
    name: string;
    location: string | null;
    totalSpots: number;
    occupiedSpots: number;
    pricePerHour: number | null;
    freeHoursPerDay: number | null;
  };
  reason: QuoteReason;
  calculatedAt: Date;
}
