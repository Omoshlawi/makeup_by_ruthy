import { NextFunction, Request, Response } from "express";
import { TopicsMddel } from "../models";
import { z } from "zod";
import { topicValidationSchema } from "../schema";
import { APIException } from "@/shared/exceprions";

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
export const addTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await topicValidationSchema.safeParseAsync({
      where: { id: req.params.id },
    });
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const topic = await TopicsMddel.create({ data: validation.data });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
export const updateTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await topicValidationSchema.safeParseAsync({
      where: { id: req.params.id },
    });
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const topic = await TopicsMddel.update({
      data: validation.data,
      where: { id: req.params.id },
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
export const deleteTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topic = await TopicsMddel.delete({
      where: { id: req.params.id },
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
