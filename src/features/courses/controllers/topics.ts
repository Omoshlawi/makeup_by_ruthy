import { NextFunction, Request, Response } from "express";
import { TopicsMddel } from "../models";
import { z } from "zod";

export const getTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topics = await TopicsMddel.findMany();
    return res.json({ results: topics });
  } catch (error) {
    next(error);
  }
};

export const getTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topics = await TopicsMddel.findUniqueOrThrow({
      where: { id: req.params.id },
    });
    return res.json({ results: topics });
  } catch (error) {
    next(error);
  }
};
