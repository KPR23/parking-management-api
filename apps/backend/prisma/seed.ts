import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@parking.com' },
    update: {},
    create: {
      email: 'admin@parking.com',
      password: hashedPassword,
      name: 'Admin',
    },
  });

  const parkingLot = await prisma.parkingLot.upsert({
    where: { name: 'Central Parking' },
    update: {},
    create: {
      name: 'Central Parking',
      location: 'Warsaw, Poland',
      totalSpots: 100,
      pricePerHour: 5.0,
      freeHoursPerDay: 2,
    },
  });

  const entryGate = await prisma.gate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      deviceId: 'ENTRY-01',
      type: 'ENTRY',
      status: 'CLOSED',
      parkingLotId: parkingLot.id,
    },
  });

  const exitGate = await prisma.gate.upsert({
    where: { id: 2 },
    update: {},
    create: {
      deviceId: 'EXIT-01',
      type: 'EXIT',
      status: 'CLOSED',
      parkingLotId: parkingLot.id,
    },
  });

  const car1 = await prisma.car.upsert({
    where: { plateNumber: 'WA12345' },
    update: {},
    create: {
      plateNumber: 'WA12345',
    },
  });

  const subscriberCar = await prisma.car.upsert({
    where: { plateNumber: 'KR54321' },
    update: {},
    create: {
      plateNumber: 'KR54321',
      subscription: {
        create: {
          type: 'monthly',
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      },
    },
  });

  const carWithEntry = await prisma.car.upsert({
    where: { plateNumber: 'WA12345' },
    update: {},
    create: {
      plateNumber: 'WA12345',
      tickets: {
        create: {
          parkingLotId: parkingLot.id,
          entryTime: new Date(new Date().getTime() - 60 * 60 * 1000),
        },
      },
    },
  });

  const carWithExit = await prisma.car.upsert({
    where: { plateNumber: 'WA123456' },
    update: {},
    create: {
      plateNumber: 'WA123456',
      tickets: {
        create: {
          parkingLotId: parkingLot.id,
          entryTime: new Date(new Date().getTime() - 3 * 60 * 60 * 1000), 
          exitTime: new Date(new Date().getTime() - 60 * 60 * 1000), 
          totalAmount: 15.0,
          isPaid: true,
          paidAt: new Date(new Date().getTime() - 60 * 60 * 1000),
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
