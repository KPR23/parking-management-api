import { GateStatus, GateType } from '../../generated/prisma/client.js';

export class GateStatusDto {
  id: number;

  parkingLotId: number;

  type: GateType;

  status: GateStatus;
}
