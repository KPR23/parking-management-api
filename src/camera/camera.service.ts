import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CameraEventType, Prisma } from '@prisma/client';
import { GateService } from 'src/gate/gate.service';
import { ParkingService } from 'src/parking/parking.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CameraExitResponseDto } from './dto/camera-exit-response.dto';
import { CameraEntryResponseDto } from './dto/camera-response.dto';

@Injectable()
export class CameraService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parkingService: ParkingService,
    private readonly gateService: GateService,
  ) {}

  private async getAndValidateGate(
    tx: Prisma.TransactionClient,
    gateId: number,
    expectedType: 'ENTRY' | 'EXIT',
  ) {
    const gate = await tx.gate.findUnique({ where: { id: gateId } });
    if (!gate) {
      throw new NotFoundException(`Gate with ID ${gateId} not found.`);
    }

    if (gate.type !== expectedType) {
      throw new BadRequestException(
        `This is a ${gate.type.toLowerCase()} gate.`,
      );
    }

    return gate;
  }

  private async createCameraEvent(
    tx: Prisma.TransactionClient,
    plateNumber: string,
    gateId: number,
    type: CameraEventType,
  ) {
    return tx.cameraEvent.create({
      data: {
        plateNumber,
        gateId,
        type,
      },
    });
  }

  async handleEntry(
    plateNumber: string,
    gateId: number,
  ): Promise<CameraEntryResponseDto> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const gate = await this.getAndValidateGate(tx, gateId, 'ENTRY');

      await this.createCameraEvent(
        tx,
        plateNumber,
        gateId,
        CameraEventType.ENTRY_DETECTED,
      );

      try {
        const ticket = await this.parkingService.entryWithTx(
          tx,
          gate.parkingLotId,
          plateNumber,
        );

        await this.gateService.openGateWithTx(tx, gateId);

        return {
          action: 'ENTRY_ALLOWED',
          ticketId: ticket.id,
          parkingLotId: gate.parkingLotId,
        } satisfies CameraEntryResponseDto;
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw new BadRequestException({
            action: 'ENTRY_BLOCKED',
            reason: error.message,
          });
        }
        throw error;
      }
    });
  }

  async handleExit(
    plateNumber: string,
    gateId: number,
  ): Promise<CameraExitResponseDto> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await this.getAndValidateGate(tx, gateId, 'EXIT');

      await this.createCameraEvent(
        tx,
        plateNumber,
        gateId,
        CameraEventType.EXIT_DETECTED,
      );

      try {
        const ticket = await this.parkingService.exitWithTx(tx, plateNumber);

        await this.gateService.openGateWithTx(tx, gateId);

        return {
          action: 'EXIT_ALLOWED',
          ticketId: ticket.id,
          totalAmount: ticket.totalAmount ?? 0,
        };
      } catch (error) {
        if (error instanceof BadRequestException) {
          throw new BadRequestException({
            action: 'EXIT_BLOCKED',
            reason: error.message,
          });
        }
        throw error;
      }
    });
  }
}
