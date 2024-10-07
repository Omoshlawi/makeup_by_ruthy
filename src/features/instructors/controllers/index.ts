import { NextFunction, Request, Response } from "express";
import { InstructorModel } from "../models";
import { UserModel } from "@/features/users/models";
import { instructorSearchSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { getFileds, paginate } from "@/services/db";

export const getInstructors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await instructorSearchSchema.safeParseAsync(req.query);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { search, page, pageSize, rating } = validation.data;
    const instructors = await UserModel.findMany({
      where: {
        AND: [
          { profile: { instructor: { isNot: null } } },
          {
            profile: {
              instructor: {
                courses: {
                  some: {
                    averageRating: {
                      gte: rating,
                      lt: rating ? rating + 1 : undefined,
                    },
                  },
                },
              },
            },
          },
          {
            OR: search
              ? [
                  {
                    username: {
                      contains: search,
                    },
                  },
                  {
                    profile: {
                      name: {
                        contains: search,
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
      ...getFileds((req.query.v as any) ?? ""),
    });
    return res.json({ results: instructors });
  } catch (error) {
    next(error);
  }
};
