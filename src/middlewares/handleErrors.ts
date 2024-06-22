import { handlePrismaErrors } from "@/services/db";
import logger from "@/shared/logger";
import { executeRollBackTasks } from "@/shared/tasks";
import { NextFunction, Request, Response } from "express";
import { entries } from "lodash";

export async function handleErrors(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(JSON.stringify(error));

  executeRollBackTasks(req);
  if (error.status) {
    return res.status(error.status).json(error.errors);
  }
  const errors = handlePrismaErrors(error);
  if (errors) return res.status(errors.status).json(errors.errors);
  logger.error("Error handler middleware: " + error.message);
  return res.status(500).json({ detail: "Internal Server Error" });
}

export default handleErrors;
