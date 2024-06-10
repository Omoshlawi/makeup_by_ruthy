import { NextFunction, Request, Response } from "express";
import { CourseModel } from "../models";
import { APIException } from "@/shared/exceprions";
import { courseSearchSchema, courseValidationSchema } from "../schema";
import { Instructor, Profile, User } from "@prisma/client";
import { paginate } from "@/utils/helpers";

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await courseSearchSchema.safeParseAsync(req.query);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const {
      language,
      level,
      maxDuration,
      minDuration,
      maxPrice,
      minPrice,
      search,
      page,
      pageSize,
    } = validation.data;

    const courses = await CourseModel.findMany({
      where: {
        AND: [
          {
            language,
            level,
            timeToComplete: { gte: minDuration, lte: maxDuration },
            price: { gte: minPrice, lte: maxPrice },
          },
          {
            OR: search
              ? [
                  {
                    title: {
                      contains: search,
                    },
                  },
                  {
                    overview: {
                      contains: search,
                    },
                  },
                  {
                    instructor: {
                      profile: {
                        OR: [
                          { email: search },
                          { phoneNumber: search },
                          { name: search },
                        ],
                      },
                    },
                  },
                ]
              : undefined,
          },
        ],
      },
      skip: paginate(pageSize, page),
      take: pageSize,
      orderBy: { createdAt: "asc" },
      include: {
        _count: true,
        instructor: true,
        modules: { include: { content: true } },
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
        modules: { include: { content: true } },
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
        modules: { include: { content: true } },
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
        modules: { include: { content: true } },
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
        modules: { include: { content: true } },
        reviews: true,
        topics: { include: { topic: true } },
      },
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
