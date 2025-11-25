/*
  Warnings:

  - You are about to drop the column `subscriptionExpiry` on the `cars` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionType` on the `cars` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GateType" AS ENUM ('ENTRY', 'EXIT');

-- CreateEnum
CREATE TYPE "GateStatus" AS ENUM ('OPEN', 'CLOSED', 'ERROR');

-- CreateEnum
CREATE TYPE "CameraEventType" AS ENUM ('ENTRY_DETECTED', 'EXIT_DETECTED');

-- AlterEnum
ALTER TYPE "SubscriptionType" ADD VALUE 'lifetime';

-- AlterTable
ALTER TABLE "cars" DROP COLUMN "subscriptionExpiry",
DROP COLUMN "subscriptionType";

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "usedDailyFree" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "gates" (
    "id" SERIAL NOT NULL,
    "parkingLotId" INTEGER NOT NULL,
    "type" "GateType" NOT NULL,
    "status" "GateStatus" NOT NULL DEFAULT 'CLOSED',

    CONSTRAINT "gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "camera_events" (
    "id" SERIAL NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "type" "CameraEventType" NOT NULL,
    "gateId" INTEGER,

    CONSTRAINT "camera_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "type" "SubscriptionType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "carId" INTEGER NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_carId_key" ON "subscriptions"("carId");

-- AddForeignKey
ALTER TABLE "gates" ADD CONSTRAINT "gates_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "parking_lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "camera_events" ADD CONSTRAINT "camera_events_gateId_fkey" FOREIGN KEY ("gateId") REFERENCES "gates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
