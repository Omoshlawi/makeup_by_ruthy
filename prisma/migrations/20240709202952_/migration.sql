/*
  Warnings:

  - A unique constraint covering the columns `[title,courseId]` on the table `Test` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,moduleId]` on the table `Test` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[testId,question]` on the table `TestQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId,choice]` on the table `TestQuestionChoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Test_title_courseId_key` ON `Test`(`title`, `courseId`);

-- CreateIndex
CREATE UNIQUE INDEX `Test_title_moduleId_key` ON `Test`(`title`, `moduleId`);

-- CreateIndex
CREATE UNIQUE INDEX `TestQuestion_testId_question_key` ON `TestQuestion`(`testId`, `question`);

-- CreateIndex
CREATE UNIQUE INDEX `TestQuestionChoice_questionId_choice_key` ON `TestQuestionChoice`(`questionId`, `choice`);
