import { UserModel } from "@/features/users/models";
import { APIException } from "@/shared/exceprions";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const requireInstructor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const instructor = await UserModel.findUnique({
      where: { id: user.id, profile: { instructor: { isNot: null } } },
      include: { profile: { include: { instructor: true } } },
    });
    if (!instructor) {
      throw new APIException(403, {
        detail: "Must be a instructor to access resource",
      });
    }

    (req as any).user = instructor;
    return next();
  } catch (error) {
    next(error);
  }
};

export const requireStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    const instructor = await UserModel.findUnique({
      where: { id: user.id, profile: { student: { isNot: null } } },
      include: { profile: { include: { student: true } } },
    });
    if (!instructor) {
      throw new APIException(403, {
        detail: "Must be a student to access resource",
      });
    }
    (req as any).user = instructor;
    return next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = (req as any).user;
    if (!user.isAdmin) {
      throw new APIException(403, {
        detail: "Must be an admin to access resource",
      });
    }
    return next();
  } catch (error) {
    next(error);
  }
};
