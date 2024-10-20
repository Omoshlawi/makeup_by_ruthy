import { NextFunction, Request, Response } from "express";
import { accountSetupSchema, ProfileSchema, userSearchSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { UserModel } from "../models";
import { isEmpty } from "lodash";
import { User } from "@prisma/client";
import { paginate } from "@/services/db";
import { getFileds } from "@/services/db";

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const validation = await ProfileSchema.safeParseAsync(req.body);
    // if (!validation.success)
    //   throw new APIException(400, validation.error.format());
    // const { gender, name, email, username, phoneNumber } = validation.data;
    // const _user = (req as any).user;
    // const errors: any = {};
    // if (
    //   await UserModel.findFirst({ where: { username, id: { not: _user.id } } })
    // )
    //   errors["username"] = { _errors: ["User with username exist"] };
    // if (await UserModel.findFirst({ where: { email, id: { not: _user.id } } }))
    //   errors["email"] = { _errors: ["User with email exist"] };
    // if (
    //   await UserModel.findFirst({
    //     where: { phoneNumber, id: { not: _user.id } },
    //   })
    // )
    //   errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
    // if (!isEmpty(errors)) throw { status: 400, errors };
    // const user = await UserModel.update({
    //   where: { id: _user.id },
    //   data: {
    //     // email,
    //     // phoneNumber,
    //     username,
    //     // gender,
    //     name,
    //   },
    // });
    // return res.json(user);
  } catch (error) {
    next(error);
  }
};

export const viewProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json(
      await UserModel.findUnique({
        where: { id: (req as any).user.id },
        include: {
          profile: {
            include: {
              instructor: { include: { specialities: true } },
              student: { include: { areasOfInterest: true } },
            },
          },
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await userSearchSchema.safeParseAsync(req.query);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { search, page, pageSize, includeAll } = validation.data;
    const include = includeAll?.trim().split(",");

    const results = await UserModel.findMany({
      where: {
        AND: [
          {
            OR: search
              ? [
                  { username: { contains: search, mode: "insensitive" } },
                  {
                    profile: {
                      name: { contains: search, mode: "insensitive" },
                    },
                  },
                  {
                    profile: {
                      email: { contains: search, mode: "insensitive" },
                    },
                  },
                  {
                    profile: {
                      phoneNumber: { contains: search, mode: "insensitive" },
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

    return res.json({ results });
  } catch (error) {
    return next(error);
  }
};

export const perfomUserAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const action = req.params.action;

    if (!["activate", "deactivate"].includes(action))
      throw new APIException(404, { detail: "Not found" });

    await UserModel.update({
      where: { id: userId, isActive: action !== "activate" },
      data: { isActive: action === "activate" },
    });
    return res.json({ detail: `User ${action} successfull` });
  } catch (error) {
    return next(error);
  }
};

export const setUpAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatopn = await accountSetupSchema.safeParseAsync(req.body);
    if (!validatopn.success)
      throw new APIException(400, validatopn.error.format());
    const user: User = (req as any).user;
    const {
      username,
      email,
      phoneNumber,
      bio,
      areasOfInterest,
      avatarUrl,
      experience,
      gender,
      name,
      skillLevel,
      specialities,
      userType,
      facebook,
      instagram,
      linkedin,
      tiktok,
      twitter,
      youtube,
    } = validatopn.data;
    const errors: any = {};

    if (
      await UserModel.findFirst({ where: { username, id: { not: user.id } } })
    )
      errors["username"] = { _errors: ["Username taken"] };
    if (
      await UserModel.findFirst({
        where: { profile: { email }, id: { not: user.id } },
      })
    )
      errors["email"] = { _errors: ["Email taken"] };
    if (
      await UserModel.findFirst({
        where: { profile: { phoneNumber }, id: { not: user.id } },
      })
    )
      errors["phoneNumber"] = { _errors: ["Phone number taken"] };
    if (!isEmpty(errors)) throw new APIException(400, errors);
    const updated = await UserModel.update({
      where: { id: user.id },
      include: { profile: { include: { instructor: true, student: true } } },
      data: {
        profileUpdated: true,
        username,
        profile: {
          update: {
            avatarUrl,
            bio,
            email,
            phoneNumber,
            name,
            socialLinks: {
              facebook,
              instagram,
              linkedin,
              tiktok,
              twitter,
              youtube,
            } as any,
            gender,
            instructor:
              userType === "Instructor"
                ? {
                    upsert: {
                      create: {
                        experience: experience!,
                        specialities: {
                          createMany: {
                            skipDuplicates: true,
                            data: specialities.map((s) => ({ topicId: s })),
                          },
                        },
                      },
                      update: {
                        experience,
                        specialities: {
                          createMany: {
                            skipDuplicates: true,
                            data: specialities.map((e) => ({ topicId: e })),
                          },
                        },
                      },
                    },
                  }
                : undefined,
            student:
              userType === "Student"
                ? {
                    upsert: {
                      create: {
                        skillLevel: skillLevel!,
                        areasOfInterest: {
                          createMany: {
                            skipDuplicates: true,
                            data: areasOfInterest.map((a) => ({ topicId: a })),
                          },
                        },
                      },
                      update: {
                        skillLevel,
                        areasOfInterest: {
                          createMany: {
                            skipDuplicates: true,
                            data: areasOfInterest.map((a) => ({ topicId: a })),
                          },
                        },
                      },
                    },
                  }
                : undefined,
          },
        },
      },
    });
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};
