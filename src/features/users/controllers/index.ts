import { NextFunction, Request, Response } from "express";
import { accountSetupSchema, ProfileSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { UserModel } from "../models";
import { isEmpty } from "lodash";
import { User } from "@prisma/client";

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
    return res.json({ results: await UserModel.findMany() });
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
