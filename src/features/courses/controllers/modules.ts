import { NextFunction, Request, Response } from "express";
import { moduleValidationSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { CourseModel, CourseModuleModel } from "../models";
import { User } from "@prisma/client";

export const addCourseModule = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const courseId: string = req.params.courseId;
    const validation = await moduleValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    if (
      await CourseModuleModel.findFirst({
        where: { courseId, title: validation.data.title },
      })
    )
      throw new APIException(400, {
        title: { errors: ["Modules title for a course must be unique"] },
      });
    const course = await CourseModel.update({
      where: {
        id: courseId,
        instructor: { profile: { userId: user.id } },
      },
      data: {
        modules: {
          create: validation.data,
        },
      },
      include: {
        _count: true,
        instructor: true,
        modules: true,
        reviews: true,
        topics: { include: { topic: true } },
      },
    });
    return res.json(course);
  } catch (error) {
    next(error);
  }
};
