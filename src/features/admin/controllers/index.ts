import { CourseModel, TopicsMddel } from "@/features/courses/models";
import { InstructorModel } from "@/features/instructors/models";
import { StudentsModel } from "@/features/students/models";
import { UserModel } from "@/features/users/models";
import { NextFunction, Request, Response } from "express";

export const getModelsAggregates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({
      topics: await TopicsMddel.count(),
      courses: {
        all: await CourseModel.count(),
        draft: await CourseModel.count({ where: { status: "Draft" } }),
        approved: await CourseModel.count({ where: { approved: true } }),
        pendingApproval: await CourseModel.count({
          where: { approved: false },
        }),
        published: await CourseModel.count({ where: { status: "Published" } }),
      },
      users: {
        all: await UserModel.count(),
        students: await StudentsModel.count(),
        instructors: await InstructorModel.count(),
      },
    });
  } catch (error) {
    next(error);
  }
};
