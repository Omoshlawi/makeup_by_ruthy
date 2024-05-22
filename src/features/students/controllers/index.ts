import { UserModel } from "@/features/users/models";
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
