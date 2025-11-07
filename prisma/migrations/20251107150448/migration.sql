-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('monthly', 'yearly');

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "subscriptionType" "SubscriptionType",
    "subscriptionExpiry" TIMESTAMP(3),

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "entryTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitTime" TIMESTAMP(3),
    "totalAmount" DOUBLE PRECISION,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "carId" INTEGER NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cars_plateNumber_key" ON "cars"("plateNumber");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
