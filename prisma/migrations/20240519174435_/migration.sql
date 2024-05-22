/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Course` table. All the data in the column will be lost.
  - You are about to alter the column `timeToComplete` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Course` DROP COLUMN `categoryId`,
    ADD COLUMN `approved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `status` ENUM('Draft', 'Published') NOT NULL DEFAULT 'Draft',
    MODIFY `timeToComplete` DECIMAL(65, 30) NOT NULL;
