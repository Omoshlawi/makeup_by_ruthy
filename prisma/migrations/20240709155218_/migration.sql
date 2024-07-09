-- AlterTable
ALTER TABLE `Content` MODIFY `type` ENUM('Video', 'Document', 'Text', 'Image', 'Test') NOT NULL;

-- AlterTable
ALTER TABLE `ModuleContentProgress` ADD COLUMN `extra` JSON NULL;
