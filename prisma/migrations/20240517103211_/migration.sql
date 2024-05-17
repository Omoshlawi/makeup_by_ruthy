/*
  Warnings:

  - You are about to drop the column `yearsOfExpirience` on the `Instructor` table. All the data in the column will be lost.
  - Added the required column `experience` to the `Instructor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Instructor` DROP COLUMN `yearsOfExpirience`,
    ADD COLUMN `experience` INTEGER NOT NULL;
