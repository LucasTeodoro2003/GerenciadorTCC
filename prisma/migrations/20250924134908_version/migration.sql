-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "enterpriseId" TEXT;

-- AddForeignKey
ALTER TABLE "Services" ADD CONSTRAINT "Services_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
