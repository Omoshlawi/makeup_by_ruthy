import logger from "@/shared/logger";
import { NextFunction, Request, Response } from "express";
import { entries } from "lodash";

export function handleErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error.status) {
    return res.status(error.status).json(error.errors);
  }
  logger.error("Error handler middleware: " + error.message);
  return res.status(500).json({ detail: "Internal Server Error" });
}

export default handleErrors;
