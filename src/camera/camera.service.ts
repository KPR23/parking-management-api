import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CameraEventType } from '@prisma/client';
import { GateService } from 'src/gate/gate.service';
import { ParkingService } from 'src/parking/parking.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CameraEntryResponseDto } from './dto/camera-response.dto';

@Injectable()
export class CameraService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parkingService: ParkingService,
    private readonly gateService: GateService,
  ) {}

  async handleEntry(plateNumber: string, gateId: number) {
    const gate = await this.prisma.gate.findUnique({ where: { id: gateId } });

    if (!gate) throw new NotFoundException(`Gate with ID ${gateId} not found.`);

    if (gate.type === 'EXIT')
      throw new BadRequestException('This is an exit gate.');

    await this.prisma.cameraEvent.create({
      data: {
        plateNumber,
        gateId,
        type: CameraEventType.ENTRY_DETECTED,
      },
    });

    try {
      const ticket = await this.parkingService.entry(
        gate.parkingLotId,
        plateNumber,
      );

      await this.gateService.openGate(gateId);

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
  }

  async handleExit(plateNumber: string, gateId: number) {
    const gate = await this.prisma.gate.findUnique({ where: { id: gateId } });

    if (!gate) throw new NotFoundException(`Gate with ID ${gateId} not found.`);

    if (gate.type === 'ENTRY')
      throw new BadRequestException('This is an entry gate.');

    await this.prisma.cameraEvent.create({
      data: {
        plateNumber,
        gateId,
        type: CameraEventType.EXIT_DETECTED,
      },
    });

    try {
      const ticket = await this.parkingService.exit(plateNumber);

      if (!ticket.isPaid && ticket.totalAmount && ticket.totalAmount > 0) {
        return {
          action: 'EXIT_BLOCKED',
          reason: 'Payment required',
          totalAmount: ticket.totalAmount,
        };
      }

      await this.gateService.openGate(gateId);

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
  }
}
