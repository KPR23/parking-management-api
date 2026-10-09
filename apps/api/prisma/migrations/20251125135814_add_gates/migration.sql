/*
  Warnings:

  - Added the required column `deviceId` to the `gates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gates" ADD COLUMN     "deviceId" TEXT NOT NULL;
