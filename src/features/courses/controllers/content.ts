import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { contentValidationSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { ContentModel, CourseModel } from "../models";
import { getFileds } from "@/services/db";

export const addModuleContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const courseId: string = req.params.courseId;
    const moduleId: string = req.params.moduleId;

    const validation = await contentValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    if (
      await ContentModel.findFirst({
        where: { moduleId, title: validation.data.title },
      })
    )
      throw new APIException(400, {
        title: { errors: ["Content title for a module must be unique"] },
      });
    // TODO Handle content Orders later
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructor: { profile: { userId: user.id } },
        modules: { some: { id: moduleId } },
      },
      data: {
        modules: {
          update: {
            where: { id: moduleId },
            data: {
              content: {
                create: {
                  ...validation.data,
                  order:
                    validation.data.order ??
                    (await ContentModel.count({ where: { moduleId } })),
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

export const updateModuleContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const courseId: string = req.params.courseId;
    const moduleId: string = req.params.moduleId;
    const contentId: string = req.params.id;

    const validation = await contentValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    if (
      await ContentModel.findFirst({
        where: {
          moduleId,
          title: validation.data.title,
          id: { not: contentId },
        },
      })
    )
      throw new APIException(400, {
        title: { errors: ["Content title for a module must be unique"] },
      });
    // TODO Handle content Orders later
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructor: { profile: { userId: user.id } },
        modules: {
          some: { id: moduleId, content: { some: { id: contentId } } },
        },
      },
      data: {
        modules: {
          update: {
            where: { id: moduleId },
            data: {
              content: {
                update: {
                  where: { id: contentId },
                  data: validation.data,
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
export const deleteModuleContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const courseId: string = req.params.courseId;
    const moduleId: string = req.params.moduleId;
    const contentId: string = req.params.id;

    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructor: { profile: { userId: user.id } },
        modules: {
          some: { id: moduleId, content: { some: { id: contentId } } },
        },
      },
      data: {
        modules: {
          update: {
            where: { id: moduleId },
            data: {
              content: {
                delete: { id: contentId },
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
