import prisma from "@/services/db";
export const CourseModel = prisma.course;
export const CourseModuleModel = prisma.module;
export const ContentModel = prisma.content;
export const TopicsMddel = prisma.topic;
export const TestModel = prisma.test;
export const TestQuestionModel = prisma.testQuestion;
export const TestQuestionChoiceModel = prisma.testQuestionChoice;
export const TestAttemptModel = prisma.testAttempt;
export const TestAttemptQuestionModel = prisma.testAttemptQuestion;

export const courseInclude = {
  tests: {
    include: {
      questions: {
        include: {
          choices: true,
        },
      },
    },
  },
  instructor: true,
  modules: {
    include: {
      content: true,
      tests: {
        include: {
          questions: {
            include: {
              choices: true,
            },
          },
        },
      },
    },
  },
  reviews: true,
  topics: { include: { topic: true } },
};
