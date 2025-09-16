/*
  Warnings:

  - You are about to drop the column `date` on the `ServiceVehicle` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `ServiceVehicle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceVehicle" DROP COLUMN "date",
DROP COLUMN "time";
