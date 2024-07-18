import { NextFunction, Request, Response } from "express";

export const getTestAttempts = async (
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

export const getTestAttempt = async (
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

export const addTestAttempts = async (
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

export const updateTestAttempts = async (
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

export const deleteTestAttempts = async (
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
