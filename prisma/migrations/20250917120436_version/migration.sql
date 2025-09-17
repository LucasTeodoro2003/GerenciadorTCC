/*
  Warnings:

  - You are about to drop the column `serviceId` on the `ServiceVehicle` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ServiceVehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ServiceVehicle" DROP CONSTRAINT "ServiceVehicle_serviceId_fkey";

-- AlterTable
ALTER TABLE "ServiceVehicle" DROP COLUMN "serviceId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ServiceVehicleService" (
    "id" TEXT NOT NULL,
    "serviceVehicleId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ServiceVehicleService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceVehicleService_serviceVehicleId_serviceId_key" ON "ServiceVehicleService"("serviceVehicleId", "serviceId");

-- AddForeignKey
ALTER TABLE "ServiceVehicleService" ADD CONSTRAINT "ServiceVehicleService_serviceVehicleId_fkey" FOREIGN KEY ("serviceVehicleId") REFERENCES "ServiceVehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVehicleService" ADD CONSTRAINT "ServiceVehicleService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
