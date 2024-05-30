/*
  Warnings:

  - A unique constraint covering the columns `[courseId,title]` on the table `Module` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Module_courseId_title_key` ON `Module`(`courseId`, `title`);
