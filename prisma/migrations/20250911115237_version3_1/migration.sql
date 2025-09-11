/*
  Warnings:

  - You are about to drop the `OtherRevenue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OtherRevenue" DROP CONSTRAINT "OtherRevenue_userId_fkey";

-- AlterTable
ALTER TABLE "Revenue" ALTER COLUMN "date" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "OtherRevenue";
