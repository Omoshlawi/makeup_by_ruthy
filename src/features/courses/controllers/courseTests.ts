import { NextFunction, Request, Response } from "express";
import {
  courseInclude,
  CourseModel,
  TestModel,
  TestQuestionModel,
} from "../models";
import { courseTestValidationSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { Instructor, Profile, User } from "@prisma/client";
import db from "@/services/db";

export const getCourseTests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    return res.json({
      results: await TestModel.findMany({
        where: { courseId },
        include: courseInclude.tests.include,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    return res.json(
      await TestModel.findUniqueOrThrow({
        where: { courseId, id: testId },
        include: courseInclude.tests.include,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const validation = await courseTestValidationSchema.safeParseAsync(
      req.body
    );
    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { questions, title } = validation.data;
    // Create Test, Questions, and Choices in a single Prisma statement
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
      },
      data: {
        tests: {
          create: {
            title,
            questions: {
              create: questions.map(({ question, choices }) => ({
                question,
                choices: {
                  create: choices.map(({ choice, answer }) => ({
                    choice,
                    answer,
                  })),
                },
              })),
            },
          },
        },
      },
      include: courseInclude,
    });

    return res.json(course);
  } catch (error) {
    next(error);
  }
};

export const updateCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    const validation = await courseTestValidationSchema.safeParseAsync(
      req.body
    );
    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { questions, title } = validation.data;

    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        tests: {
          some: { id: testId },
        },
      },
      data: {
        tests: {
          update: {
            where: { id: testId },
            data: {
              title,
            },
          },
        },
      },
      include: {
        tests: true,
      },
    });

    const questionsUpdateTasks = await Promise.allSettled([
      questions.map((q) =>
        TestQuestionModel.upsert({
          where: {
            testId_question: { testId, question: q.question },
            question: q.question,
            testId,
          },
          create: {
            question: q.question,
            testId,
            choices: {
              createMany: {
                skipDuplicates: true,
                data: q.choices,
              },
            },
          },
          update: {
            question: q.question,
            choices: {
              createMany: {
                skipDuplicates: true,
                data: q.choices,
              },
            },
          },
        })
      ),
    ]);

    return res.json(
      await CourseModel.findUnique({
        where: { id: courseId },
        include: courseInclude,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ results: req.params });
  } catch (error) {
    next(error);
  }
};
