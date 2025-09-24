-- AlterTable
ALTER TABLE "ServiceVehicle" ADD COLUMN     "enterpriseId" TEXT;

-- AddForeignKey
ALTER TABLE "ServiceVehicle" ADD CONSTRAINT "ServiceVehicle_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
