/*
  Warnings:

  - Added the required column `skillLevel` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Student` ADD COLUMN `skillLevel` ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL;
