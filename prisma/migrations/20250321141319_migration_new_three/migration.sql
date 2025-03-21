/*
  Warnings:

  - You are about to drop the column `senha` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "senha",
ADD COLUMN     "password" TEXT;
