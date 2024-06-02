/*
  Warnings:

  - You are about to drop the column `metadata` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Review` table. All the data in the column will be lost.
  - Added the required column `order` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `progress` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Content` DROP COLUMN `metadata`,
    ADD COLUMN `order` INTEGER NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Enrollment` ADD COLUMN `completionDate` DATETIME(3) NULL,
    ADD COLUMN `progress` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Module` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Review` DROP COLUMN `text`,
    ADD COLUMN `comment` TEXT NULL;
