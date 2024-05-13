import { NextFunction, Request, Response } from "express";
import { ProfileSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { UserModel } from "../models";
import { isEmpty } from "lodash";

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
        include: { profile: { include: { instructor: true, student: true } } },
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
    next(error);
  }
};
