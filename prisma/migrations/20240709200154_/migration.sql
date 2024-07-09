/*
  Warnings:

  - Added the required column `question` to the `TestQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestQuestion` ADD COLUMN `question` VARCHAR(191) NOT NULL;
