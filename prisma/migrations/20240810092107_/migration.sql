-- AlterTable
ALTER TABLE `Course` ADD COLUMN `averageRating` DOUBLE NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `CourseReview` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;
