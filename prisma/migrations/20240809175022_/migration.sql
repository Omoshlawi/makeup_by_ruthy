/*
  Warnings:

  - You are about to drop the column `studentId` on the `CourseReview` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `CourseReview` DROP FOREIGN KEY `CourseReview_studentId_fkey`;

-- AlterTable
ALTER TABLE `CourseReview` DROP COLUMN `studentId`;
