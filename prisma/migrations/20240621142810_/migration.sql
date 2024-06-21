/*
  Warnings:

  - You are about to alter the column `progress` on the `Enrollment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Enrollment` MODIFY `progress` JSON NULL;
