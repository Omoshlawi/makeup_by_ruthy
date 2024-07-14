import { APIException } from "@/shared/exceprions";
import { Instructor, Profile, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { courseInclude, CourseModel, TestModel } from "../models";
import { courseTestValidationSchema } from "../schema";

export const getTests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const moduleId = req.params.moduleId;
    const courseId = req.params.courseId;
    return res.json({
      results: await TestModel.findMany({
        where: {
          courseId: isModuleTest ? undefined : courseId,
          moduleId: isModuleTest ? moduleId : undefined,
        },
        include: courseInclude.tests.include,
      }),
    });
  } catch (error) {
    next(error);
  }
};

export const getTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const moduleId = req.params.moduleId;
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    return res.json(
      await TestModel.findUniqueOrThrow({
        where: {
          courseId: isModuleTest ? undefined : courseId,
          id: testId,
          moduleId: isModuleTest ? moduleId : undefined,
        },
        include: courseInclude.tests.include,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const addTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const moduleId = req.params.moduleId;
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
        modules: {
          some: {
            id: moduleId,
          },
        },
      },
      data: {
        tests: isModuleTest
          ? undefined
          : {
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
        modules: !isModuleTest
          ? undefined
          : {
              update: {
                where: { id: moduleId },
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

export const updateTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const moduleId = req.params.moduleId;
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

    const { title } = validation.data;

    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        tests: isModuleTest
          ? undefined
          : {
              some: { id: testId },
            },
        modules: isModuleTest
          ? {
              some: {
                id: moduleId,
                tests: {
                  some: {
                    id: testId,
                  },
                },
              },
            }
          : undefined,
      },
      data: {
        tests: isModuleTest
          ? undefined
          : {
              update: {
                where: { id: testId },
                data: {
                  title,
                },
              },
            },
        modules: isModuleTest
          ? {
              update: {
                where: { id: moduleId },
                data: {
                  tests: {
                    update: {
                      where: { id: testId },
                      data: { title },
                    },
                  },
                },
              },
            }
          : undefined,
      },
      include: courseInclude,
    });

    return res.json(course);
  } catch (error) {
    next(error);
  }
};

export const deleteTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isModuleTest = req.originalUrl.includes("modules");
    const moduleId = req.params.moduleId;
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        tests: isModuleTest
          ? undefined
          : {
              some: { id: testId },
            },
        modules: isModuleTest
          ? {
              some: {
                id: moduleId,
                tests: {
                  some: {
                    id: testId,
                  },
                },
              },
            }
          : undefined,
      },
      data: {
        tests: isModuleTest
          ? undefined
          : {
              delete: { id: testId },
            },
        modules: isModuleTest
          ? {
              update: {
                where: { id: moduleId },
                data: {
                  tests: {
                    delete: { id: testId },
                  },
                },
              },
            }
          : undefined,
      },
      include: courseInclude,
    });
    return res.json(course);
  } catch (error) {
    next(error);
  }
};
