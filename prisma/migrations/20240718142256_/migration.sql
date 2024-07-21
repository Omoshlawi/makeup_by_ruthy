/*
  Warnings:

  - Added the required column `enrollmentId` to the `TestAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TestAttempt` ADD COLUMN `enrollmentId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `TestAttempt` ADD CONSTRAINT `TestAttempt_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `Enrollment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
