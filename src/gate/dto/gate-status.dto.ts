import { GateStatus, GateType } from '@prisma/client';

export class GateStatusDto {
  id: number;
  parkingLotId: number;
  type: GateType;
  status: GateStatus;
}
