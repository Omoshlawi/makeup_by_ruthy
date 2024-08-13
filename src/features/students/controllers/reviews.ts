import { APIException } from "@/shared/exceprions";
import { Profile, Student, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { reviewValidationSchema } from "../schema";
import { CourseReviewModel, EnrollmentModel } from "../models";

export const postReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enrollmentId = req.params.enrollmentId;
    const validation = await reviewValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    const { comment, rating } = validation.data;
    // Update enrollment
    const enrollment = await EnrollmentModel.update({
      where: { id: enrollmentId, studentId: student.profile.student.id },
      data: {
        reviews: {
          create: {
            rating,
            comment,
          },
        },
        course: {
          update: {
            averageRating:
              (
                await CourseReviewModel.aggregate({
                  _avg: {
                    rating: true,
                  },
                  where: {
                    enrollmentId,
                  },
                })
              )._avg.rating ?? 0.0,
          },
        },
      },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        course: true,
      },
    });
    return res.json(enrollment.reviews[0]);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = req.params.reviewId;
    const enrollmentId = req.params.enrollmentId;
    const validation = await reviewValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    const { comment, rating } = validation.data;
    // Update enrollment
    const enrollment = await EnrollmentModel.findUniqueOrThrow({
      where: { id: enrollmentId, studentId: student.profile.student.id },
    });
    return res.json(
      await CourseReviewModel.update({
        where: { id: reviewId, enrollmentId: enrollmentId },
        data: {
          rating,
          comment,
          enrollmentId: enrollment.id,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = req.params.reviewId;

    // Delete review ad update avg rating on course

    return res.json({ detail: "Review deleted succesfully" });
  } catch (error) {
    next(error);
  }
};

export const getCourseReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.courseId;
    const reviews = await CourseReviewModel.findMany({
      where: {
        enrollment: {
          courseId,
        },
      },
      include: {
        enrollment: {
          include: {
            student: {
              include: {
                profile: {
                  include: {
                    user: {
                      select: {
                        isAdmin: true,
                        username: true,
                        createdAt: true,
                        updatedAt: true,
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ results: reviews });
  } catch (error) {
    next(error);
  }
};
