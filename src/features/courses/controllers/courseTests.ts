import { NextFunction, Request, Response } from "express";
import { TestModel } from "../models";

export const getCourseTests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    return res.json({
      results: await TestModel.findMany({ where: { courseId } }),
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const testId = req.params.testId;
    return res.json(
      await TestModel.findUniqueOrThrow({ where: { courseId, id: testId } })
    );
  } catch (error) {
    next(error);
  }
};

export const addCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId
    return res.json({ results: req.params });
  } catch (error) {
    next(error);
  }
};

export const updateCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ results: req.params });
  } catch (error) {
    next(error);
  }
};

export const deleteCourseTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json({ results: req.params });
  } catch (error) {
    next(error);
  }
};
