import { NextFunction, Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "@/features/auth/schema";
import { APIException } from "@/shared/exceprions";
import { UserModel } from "@/features/users/models";
import { isEmpty } from "lodash";
import {
  checkPassword,
  generateUserToken,
  hashPassword,
} from "@/utils/helpers";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await RegisterSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { password, email, username, phoneNumber } = validation.data;
    const errors: any = {};
    if (await UserModel.findFirst({ where: { username } }))
      errors["username"] = { _errors: ["User with username exist"] };
    if (await UserModel.findFirst({ where: { profile: { email } } }))
      errors["email"] = { _errors: ["User with email exists"] };
    if (await UserModel.findFirst({ where: { profile: { phoneNumber } } }))
      errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
    if (!isEmpty(errors)) throw { status: 400, errors };

    const user = await UserModel.create({
      include: { profile: true },
      data: {
        username,
        password: await hashPassword(password),
        profile: {
          create: {
            email,
            phoneNumber,
          },
        },
      },
    });
    const token = generateUserToken({ id: user.id });
    return res
      .setHeader("x-access-token", token)
      .setHeader("x-refresh-token", token)
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await LoginSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { password, username } = validation.data;
    const users = await UserModel.findMany({
      include: { profile: true },
      where: {
        OR: [
          { username },
          { profile: { email: username } },
          { profile: { phoneNumber: username } },
        ],
        isActive: true,
      },
    });
    const passwordChecks = await Promise.all(
      users.map((user) => checkPassword(user.password, password))
    );
    if (passwordChecks.every((val) => val === false))
      throw {
        status: 400,
        errors: {
          username: { _errors: ["Invalid username or password"] },
          password: { _errors: ["Invalid username or password"] },
        },
      };
    const user = users[passwordChecks.findIndex((val) => val)];
    const token = generateUserToken({ id: user.id });
    return res
      .setHeader("x-access-token", token)
      .setHeader("x-refresh-token", token)
      .json({ user, token });
  } catch (error) {
    next(error);
  }
};
