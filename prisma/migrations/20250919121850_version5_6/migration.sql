/*
  Warnings:

  - You are about to drop the column `finished` on the `ServiceVehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceVehicle" DROP COLUMN "finished";

-- AlterTable
ALTER TABLE "ServiceVehicleService" ADD COLUMN     "finished" BOOLEAN NOT NULL DEFAULT false;
