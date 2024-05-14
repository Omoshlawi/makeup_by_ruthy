import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

export const validateUUIDPathParam =
  (paramName: string) =>
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      req;
      if (!z.string().uuid().safeParse(req.params[paramName]).success)
        throw { status: 404, errors: { detail: "Not found" } };
      return next();
    } catch (error) {
      return next(error);
    }
  };
