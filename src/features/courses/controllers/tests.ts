import { APIException } from "@/shared/exceprions";
import { Instructor, Profile, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { courseInclude, CourseModel, TestModel } from "../models";
import { courseTestValidationSchema } from "../schema";
import { getFileds } from "@/services/db";

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
        ...getFileds((req.query.v as any) ?? ""),
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
        ...getFileds((req.query.v as any) ?? ""),
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

    const { questions, title, order } = validation.data;
    // Create Test, Questions, and Choices in a single Prisma statement
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructorId: user.profile.instructor.id,
        modules: isModuleTest
          ? {
              some: {
                id: moduleId,
              },
            }
          : undefined,
      },

      data: {
        tests: isModuleTest
          ? undefined
          : {
              create: {
                order:
                  order ?? (await TestModel.count({ where: { courseId } })) + 1,
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
                      order:
                        order ??
                        (await TestModel.count({ where: { moduleId } })) + 1,
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
      ...getFileds((req.query.v as any) ?? ""),
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

    const { title, questions, order } = validation.data;

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
                  order,
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
                      data: { title, order },
                    },
                  },
                },
              },
            }
          : undefined,
      },
      ...getFileds((req.query.v as any) ?? ""),
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
      ...getFileds((req.query.v as any) ?? ""),
    });
    return res.json(course);
  } catch (error) {
    next(error);
  }
};
