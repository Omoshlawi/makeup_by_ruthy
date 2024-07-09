import prisma from "@/services/db";

export const CourseModel = prisma.course;
export const CourseModuleModel = prisma.module;
export const ContentModel = prisma.content;
export const TopicsMddel = prisma.topic;
export const TestModel = prisma.test;
export const TestQuestionModel = prisma.testQuestion;
export const TestQuestionChoiceModel = prisma.testQuestionChoice;
