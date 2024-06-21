import { UserModel } from "@/features/users/models";
import { Profile, Student, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await UserModel.findMany({
      where: { profile: { student: { isNot: null } } },
      include: {
        profile: {
          include: { student: true },
        },
      },
    });
    return res.json({ results: students });
  } catch (error) {
    next(error);
  }
};

export const enroll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    
  } catch (error) {
    next(error);
  }
};
