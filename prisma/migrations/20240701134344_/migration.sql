/*
  Warnings:

  - A unique constraint covering the columns `[contentId,moduleProgressId]` on the table `ModuleContentProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ModuleContentProgress_contentId_moduleProgressId_key` ON `ModuleContentProgress`(`contentId`, `moduleProgressId`);
