/*
  Warnings:

  - You are about to drop the column `progress` on the `Enrollment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Enrollment` DROP COLUMN `progress`;

-- CreateTable
CREATE TABLE `ModuleProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `moduleId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ModuleProgress_enrollmentId_moduleId_key`(`enrollmentId`, `moduleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ModuleContentProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `moduleProgressId` INTEGER NOT NULL,
    `contentId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ModuleProgress` ADD CONSTRAINT `ModuleProgress_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `Enrollment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleProgress` ADD CONSTRAINT `ModuleProgress_moduleId_fkey` FOREIGN KEY (`moduleId`) REFERENCES `Module`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleContentProgress` ADD CONSTRAINT `ModuleContentProgress_moduleProgressId_fkey` FOREIGN KEY (`moduleProgressId`) REFERENCES `ModuleProgress`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ModuleContentProgress` ADD CONSTRAINT `ModuleContentProgress_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `Content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
