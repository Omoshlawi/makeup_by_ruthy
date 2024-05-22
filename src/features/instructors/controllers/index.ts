import { NextFunction, Request, Response } from "express";
import { InstructorModel } from "../models";
import { UserModel } from "@/features/users/models";

export const getInstructors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const instructors = await UserModel.findMany({
      where: { profile: { instructor: { isNot: null } } },
      include: {
        profile: {
          include: { instructor: true },
        },
      },
    });
    return res.json({ results: instructors });
  } catch (error) {
    next(error);
  }
};
