export class ParkingExitResponse {
  id: number;
  entryTime: Date;
  exitTime: Date;
  totalAmount: number;
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
}
