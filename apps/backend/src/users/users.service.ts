import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(data.password, salt);
    return this.prisma.user.create({
      data: {
        ...data,
        password,
      },
    });
  }
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
