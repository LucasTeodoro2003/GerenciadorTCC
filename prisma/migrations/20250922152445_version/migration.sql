/*
  Warnings:

  - You are about to drop the column `obs` on the `ServiceVehicleService` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ServiceVehicle" ADD COLUMN     "obs" TEXT;

-- AlterTable
ALTER TABLE "ServiceVehicleService" DROP COLUMN "obs";
