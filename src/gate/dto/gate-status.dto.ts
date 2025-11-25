import { ApiProperty } from '@nestjs/swagger';
import { GateStatus, GateType } from '@prisma/client';

export class GateStatusDto {
  @ApiProperty({ description: 'The ID of the gate', example: 1 })
  id: number;

  @ApiProperty({ description: 'The ID of the parking lot', example: 1 })
  parkingLotId: number;

  @ApiProperty({
    description: 'The type of the gate',
    enum: GateType,
    example: GateType.ENTRY,
  })
  type: GateType;

  @ApiProperty({
    description: 'The status of the gate',
    enum: GateStatus,
    example: GateStatus.OPEN,
  })
  status: GateStatus;
}
