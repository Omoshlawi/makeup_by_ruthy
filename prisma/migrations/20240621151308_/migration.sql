-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `enrollmentId` VARCHAR(191) NOT NULL,
    `complete` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `merchantRequestId` VARCHAR(191) NOT NULL,
    `checkoutRequestId` VARCHAR(191) NOT NULL,
    `resultCode` VARCHAR(191) NULL,
    `resultDescription` VARCHAR(191) NULL,
    `mpesareceiptNumber` VARCHAR(191) NULL,
    `transactionDate` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Payment_id_key`(`id`),
    UNIQUE INDEX `Payment_enrollmentId_key`(`enrollmentId`),
    UNIQUE INDEX `Payment_merchantRequestId_key`(`merchantRequestId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `Enrollment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
