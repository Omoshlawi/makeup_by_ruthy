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
  topics: { include: { topic: true } },
};

export const enrollmentInclude = {
  course: { include: courseInclude },
  attempts: {
    include: {
      attemptQuestions: true,
    },
  },
  moduleProgress: {
    select: {
      id: true,
      moduleId: true,
      contents: {
        select: {
          id: true,
          contentId: true,
          createdAt: true,
        },
      },
      createdAt: true,
    },
  },
  payment: {
    select: {
      amount: true,
      mpesareceiptNumber: true,
      complete: true,
      phoneNumber: true,
      createdAt: true,
      updatedAt: true,
      id: true,
      transactionDate: true,
      enrollmentId: true,
      description: true,
    },
  },
};
