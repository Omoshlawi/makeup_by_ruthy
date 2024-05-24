/*
  Warnings:

  - You are about to alter the column `previewVideo` on the `Course` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Course` MODIFY `previewVideo` JSON NOT NULL;
