import { NextFunction, Request, Response } from "express";
import { TopicsMddel } from "../models";
import { z } from "zod";
import { tagSearchSchema, topicValidationSchema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { paginate } from "@/services/db";
import { getFileds } from "@/services/db";

export const getTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = await tagSearchSchema.safeParseAsync(req.query);
    if (!validation.success)
      throw new APIException(400, validation.error.format());

    const { search, page, pageSize } = validation.data;
    const topics = await TopicsMddel.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { overview: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      },
      skip: paginate(pageSize, page),
      take: pageSize,
      orderBy: { createdAt: "asc" },
      ...getFileds((req.query.v as any) ?? ""),
    });
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
      ...getFileds((req.query.v as any) ?? ""),
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
    const validation = await topicValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const topic = await TopicsMddel.create({
      data: validation.data,
      ...getFileds((req.query.v as any) ?? ""),
    });
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
    const validation = await topicValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const topic = await TopicsMddel.update({
      data: validation.data,
      where: { id: req.params.id },
      ...getFileds((req.query.v as any) ?? ""),
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
      ...getFileds((req.query.v as any) ?? ""),
    });
    return res.json(topic);
  } catch (error) {
    next(error);
  }
};
