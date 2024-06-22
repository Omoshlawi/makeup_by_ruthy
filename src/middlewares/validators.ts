import { APIException } from "@/shared/exceprions";
import { normalizeIp } from "@/utils/helpers";
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

export const validateIPAddress =
  (allowedIpAddresses: String[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const requestIp = normalizeIp(
      (req.ip || req.socket.remoteAddress || req.connection.remoteAddress) ?? ""
    );

    // Check if the request IP is in the allowed list
    if (!requestIp || !allowedIpAddresses.includes(requestIp)) {
      return next(
        new APIException(403, { detail: "Forbidden: Access is denied." })
      );
    }

    return next();
  };
