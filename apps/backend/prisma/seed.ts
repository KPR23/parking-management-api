import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Parking Lot
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
  console.log({ parkingLot });

  // 2. Create Gates
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
  console.log({ entryGate });

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
  console.log({ exitGate });

  // 3. Create Cars
  const car1 = await prisma.car.upsert({
    where: { plateNumber: 'WA12345' },
    update: {},
    create: {
      plateNumber: 'WA12345',
    },
  });
  console.log({ car1 });

  // 4. Create Subscriber Car
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
  console.log({ subscriberCar });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
