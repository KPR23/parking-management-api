import { Injectable, NotFoundException } from '@nestjs/common';
import { GateStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GateStatusDto } from './dto/gate-status.dto';

@Injectable()
export class GateService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(id: number): Promise<GateStatusDto> {
    const gate = await this.prisma.gate.findUnique({
      where: { id },
    });

    if (!gate) {
      throw new NotFoundException('Gate not found.');
    }

    return gate;
  }

  async openGate(id: number): Promise<GateStatusDto> {
    return this.prisma.$transaction(async (tx) => {
      const gate = await tx.gate.findUnique({ where: { id } });
      if (!gate) {
        throw new NotFoundException(`Gate with ID ${id} not found.`);
      }

      const updated = await tx.gate.update({
        where: { id },
        data: { status: GateStatus.OPEN },
      });

      return {
        id: updated.id,
        parkingLotId: updated.parkingLotId,
        type: updated.type,
        status: updated.status,
      };
    });
  }

  async closeGate(id: number): Promise<GateStatusDto> {
    return this.prisma.$transaction(async (tx) => {
      const gate = await tx.gate.findUnique({ where: { id } });

      if (!gate) {
        throw new NotFoundException(`Gate with ID ${id} not found.`);
      }

      const updated = await tx.gate.update({
        where: { id },
        data: { status: GateStatus.CLOSED },
      });

      return {
        id: updated.id,
        parkingLotId: updated.parkingLotId,
        type: updated.type,
        status: updated.status,
      };
    });
  }
}
