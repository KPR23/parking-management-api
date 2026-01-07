/*
  Warnings:

  - Added the required column `parkingLotId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "parkingLotId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "parking_lots" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "totalSpots" INTEGER NOT NULL,
    "occupiedSpots" INTEGER NOT NULL DEFAULT 0,
    "pricePerHour" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "freeHoursPerDay" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_lots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_lots_name_key" ON "parking_lots"("name");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "parking_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
