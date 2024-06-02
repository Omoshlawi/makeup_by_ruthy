/*
  Warnings:

  - A unique constraint covering the columns `[moduleId,title]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Content_moduleId_title_key` ON `Content`(`moduleId`, `title`);
