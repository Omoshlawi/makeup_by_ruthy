import { NextFunction, Request, Response } from "express";
import { courseInclude, CourseModel, TestQuestionModel } from "../models";
import { testQuestionValidationSChema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { Instructor, Profile, User } from "@prisma/client";

export const getTestQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    const questions = await TestQuestionModel.findMany({
      where: {
        testId,
      },
      include: {
        choices: true,
        test: true,
      },
    });
    return res.json({ results: questions });
  } catch (error) {
    next(error);
  }
};

export const getTestQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    return res.json({ results: req.params });
  } catch (error) {
    next(error);
  }
};

export const addTestQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    const moduleId = req.params.moduleId;
    const isModuleTest = req.originalUrl.includes("modules");

    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;

    const validation = await testQuestionValidationSChema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { choices, question } = validation.data;
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        modules: {
          some: {
            id: moduleId,
          },
        },
        tests: {
          some: {
            id: testId,
          },
        },
      },
      data: {
        tests: {
          update: {
            where: { id: testId },
            data: {
              questions: {
                create: {
                  question,
                  choices: {
                    createMany: {
                      skipDuplicates: true,
                      data: choices,
                    },
                  },
                },
              },
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

export const updateTestQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // NOTE: Does not delete choices wrather updates or creates if dont exist
    const isModuleTest = req.originalUrl.includes("modules");
    const questionId = req.params.questionId;
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    const moduleId = req.params.moduleId;

    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;

    const validation = await testQuestionValidationSChema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { choices, question } = validation.data;
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        modules: {
          some: {
            id: moduleId,
          },
        },
        tests: {
          some: {
            id: testId,
          },
        },
      },
      data: {
        tests: {
          update: {
            where: { id: testId },
            data: {
              questions: {
                update: {
                  where: { id: questionId },
                  data: {
                    question,
                    choices: {
                      upsert: choices.map((ch) => ({
                        where: {
                          questionId_choice: { questionId, choice: ch.choice },
                        },
                        create: { choice: ch.choice, answer: ch.answer },
                        update: {
                          choice: ch.choice,
                          answer: ch.answer,
                        },
                      })),
                    },
                  },
                },
              },
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

export const deleteTestQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const questionId = req.params.questionId;
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    const moduleId = req.params.moduleId;

    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;

    const validation = await testQuestionValidationSChema.safeParseAsync(
      req.body
    );
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { choices, question } = validation.data;
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        modules: {
          some: {
            id: moduleId,
          },
        },
        tests: {
          some: {
            id: testId,
          },
        },
      },
      data: {
        tests: {
          update: {
            where: { id: testId },
            data: {
              questions: {
                delete: {
                  id: questionId,
                },
              },
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
