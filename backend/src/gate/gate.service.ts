import { Injectable, NotFoundException } from '@nestjs/common';
import { GateStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GateStatusDto } from './dto/gate-status.dto';

@Injectable()
export class GateService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(id: number): Promise<GateStatusDto> {
    const gate = await this.prisma.gate.findUnique({ where: { id } });
    if (!gate) {
      throw new NotFoundException('Gate not found.');
    }
    return gate;
  }

  async openGateWithTx(
    tx: Prisma.TransactionClient,
    id: number,
  ): Promise<GateStatusDto> {
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
  }

  async closeGateWithTx(
    tx: Prisma.TransactionClient,
    id: number,
  ): Promise<GateStatusDto> {
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
  }

  async openGate(id: number): Promise<GateStatusDto> {
    return await this.prisma.$transaction((tx) => this.openGateWithTx(tx, id));
  }

  async closeGate(id: number): Promise<GateStatusDto> {
    return await this.prisma.$transaction((tx) => this.closeGateWithTx(tx, id));
  }
}
