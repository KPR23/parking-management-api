import { Injectable, NotFoundException } from '@nestjs/common';
import { Gate } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GateService {
  constructor(private readonly prisma: PrismaService) {}
  async getStatus(id: number): Promise<Gate> {
    const gate = await this.prisma.gate.findUnique({
      where: { id },
    });

    if (!gate) {
      throw new NotFoundException('Gate not found.');
    }

    return gate;
  }
}
