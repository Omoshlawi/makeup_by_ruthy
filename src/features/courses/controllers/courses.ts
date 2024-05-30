import { NextFunction, Request, Response } from "express";
import { CourseModel } from "../models";
import { APIException } from "@/shared/exceprions";
import { courseValidationSchema } from "../schema";
import { Instructor, Profile, User } from "@prisma/client";

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await CourseModel.findMany({
      include: {
        _count: true,
        instructor: true,
        modules: true,
        reviews: true,
        topics: { include: { topic: true } },
      },
    });
    return res.json({ results: courses });
  } catch (error) {
    return next(error);
  }
};

export const getCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await CourseModel.findUniqueOrThrow({
      where: { id: req.params.id },
      include: {
        _count: true,
        instructor: true,
        modules: true,
        reviews: true,
        topics: { include: { topic: true } },
      },
    });
    return res.json({ results: course });
  } catch (error) {
    next(error);
  }
};
export const addCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User & { profile: Profile & { instructor: Instructor } } = (
      req as any
    ).user;
    const validation = await courseValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const topic = await CourseModel.create({
      include: {
        _count: true,
        instructor: true,
        modules: true,
        reviews: true,
        topics: { include: { topic: true } },
      },
      data: {
        ...{
          ...validation.data,
          previewVideoSource: undefined,
          previewVideo: {
            url: validation.data.previewVideo,
            source: validation.data.previewVideoSource,
          },
        },
        instructorId: user.profile.instructor.id,
        topics: {
          createMany: {
            skipDuplicates: true,
            data: validation.data.topics.map((tag) => ({ topicId: tag })),
          },
        },
      },
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const validation = await courseValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const topic = await CourseModel.update({
      include: {
        _count: true,
        instructor: true,
        modules: true,
        reviews: true,
        topics: { include: { topic: true } },
      },
      data: {
        ...{
          ...validation.data,
          previewVideoSource: undefined,
          previewVideo: {
            url: validation.data.previewVideo,
            source: validation.data.previewVideoSource,
          },
        },
        topics: {
          deleteMany: { courseId: req.params.id },
          createMany: {
            skipDuplicates: true,
            data: validation.data.topics.map((topic) => ({ topicId: topic })),
          },
        },
      },
      where: {
        id: req.params.id,
        instructor: { profile: { userId: user.id } },
      },
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topic = await CourseModel.delete({
      where: { id: req.params.id },
      include: {
        _count: true,
        instructor: true,
        modules: true,
        reviews: true,
        topics: { include: { topic: true } },
      },
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
