import { UserModel } from "@/features/users/models";
import { Profile, Student, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { enrollmentValidationShema } from "../schema";
import { APIException } from "@/shared/exceprions";
import { CourseModel } from "@/features/courses/models";
import { normalizePhoneNumber } from "@/utils/helpers";
import { Mpesa } from "daraja.js";
import { configuration } from "@/utils";
import { PaymentModel } from "@/features/payments/models";
import { EnrollmentModel } from "../models";
import { triggerStkPush } from "@/services/mpesa";

export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await UserModel.findMany({
      where: { profile: { student: { isNot: null } } },
      include: {
        profile: {
          include: { student: true },
        },
      },
    });
    return res.json({ results: students });
  } catch (error) {
    next(error);
  }
};

export const enroll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate payload
    const validation = await enrollmentValidationShema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    // Assert course exist and user aint auther and user aint enrolled and completed payment to it yet
    const course = await CourseModel.findUniqueOrThrow({
      where: {
        id: req.params.courseId,
        instructor: { profile: { userId: { not: student.id } } },
        enrollments: {
          none: {
            studentId: student.profile.student.id,
            // payment: { complete: true },
          },
        },
      },
      include: { enrollments: true },
    });

    // Clean phone number by removing code +?254|0
    const phoneNumber = normalizePhoneNumber(validation.data.phoneNumber);

    // Initiate stk push
    const { data } = await triggerStkPush(
      phoneNumber,
      Number(course.price),
      `Payment for course ${course.id}(${course.title})`
    );
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResponseCode,
      ResponseDescription,
      CustomerMessage,
    } = data ?? {};

    // Create enrollment
    const enrollemt = await EnrollmentModel.create({
      data: {
        cost: course.price,
        courseId: course.id,
        studentId: student.profile.student.id,
        payment: {
          create: {
            checkoutRequestId: CheckoutRequestID,
            merchantRequestId: MerchantRequestID,
            resultCode: ResponseCode,
            resultDescription: `${ResponseDescription}-${CustomerMessage}`,
          },
        },
      },
      include: {
        course: true,
        payment: {
          select: {
            amount: true,
            mpesareceiptNumber: true,
            complete: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            transactionDate: true,
            enrollmentId: true,
            description: true,
          },
        },
      },
    });

    return res.json({
      detail:
        "Enrollment succesfull, KIndly complete payment to access course content",
        enrollment:enrollemt,
    });
  } catch (error) {
    next(error);
  }
};

export const completeEnrollmentPayement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate payload
    const validation = await enrollmentValidationShema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    // Assert enrollemtn exist and it bellongs to curr user and either has incomplete payment
    let enrollment;
    enrollment = await EnrollmentModel.findUniqueOrThrow({
      where: {
        id: req.params.enrollmentId,
        studentId: student.profile.student.id,
        OR: [{ payment: null }, { payment: { complete: false } }],
      },
      include: {
        course: true,
        payment: {
          select: {
            amount: true,
            mpesareceiptNumber: true,
            complete: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            transactionDate: true,
            enrollmentId: true,
            description: true,
          },
        },
      },
    });

    // Clean phone number by removing code +?254|0
    const phoneNumber = normalizePhoneNumber(validation.data.phoneNumber);

    // Initiate stk push
    const { data } = await triggerStkPush(
      phoneNumber,
      Number(enrollment.course.price),
      `Payment for course ${enrollment.courseId}(${enrollment.course.title})`
    );
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResponseCode,
      ResponseDescription,
      CustomerMessage,
    } = data ?? {};

    // Update or create enrollment
    enrollment = await EnrollmentModel.update({
      where: {
        id: enrollment.id,
      },
      data: {
        cost: enrollment.course.price,
        payment: {
          delete: { id: enrollment.payment?.id }, //First delete previous payment attempt if any
          create: {
            checkoutRequestId: CheckoutRequestID,
            merchantRequestId: MerchantRequestID,
            resultCode: ResponseCode,
            resultDescription: `${ResponseDescription}-${CustomerMessage}`,
          }, // Create new payment
        },
      },
      include: {
        course: true,
        payment: {
          select: {
            amount: true,
            mpesareceiptNumber: true,
            complete: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            transactionDate: true,
            enrollmentId: true,
            description: true,
          },
        },
      },
    });

    return res.json({
      detail: "KIndly complete mpesa payment to access course content",
      enrollment: enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    const enrollments = await EnrollmentModel.findMany({
      where: { studentId: student.profile.student.id },
      include: {
        course: true,
        payment: {
          select: {
            amount: true,
            mpesareceiptNumber: true,
            complete: true,
            phoneNumber: true,
            createdAt: true,
            updatedAt: true,
            id: true,
            transactionDate: true,
            enrollmentId: true,
            description: true,
          },
        },
      },
    });
    return res.json({ results: enrollments });
  } catch (error) {
    next(error);
  }
};
