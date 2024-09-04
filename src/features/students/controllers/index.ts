import { CourseModel, enrollmentInclude } from "@/features/courses/models";
import { UserModel } from "@/features/users/models";
import { triggerStkPush } from "@/services/mpesa";
import { APIException } from "@/shared/exceprions";
import { normalizePhoneNumber } from "@/utils/helpers";
import { Profile, Student, User } from "@prisma/client";
import ejs from "ejs";
import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import htmToPdf from "html-pdf";
import path from "path";
import { EnrollmentModel } from "../models";
import { enrollmentValidationShema } from "../schema";

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
      enrollment: enrollemt,
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
        reviews: true,
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
      include: enrollmentInclude,
    });
    return res.json({ results: enrollments });
  } catch (error) {
    next(error);
  }
};

export const getMyEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    const enrollments = await EnrollmentModel.findUniqueOrThrow({
      where: { studentId: student.profile.student.id, id: req.params.id },
      include: enrollmentInclude,
    });
    return res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

export const progress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Assetain enrollment exist
   * Assertain enrollment payment is complete
   * Asertain enrollment course module and asociated content exist
   * Creates a progress if none already exist else throws an error
   */
  try {
    const contentId = req.params.contentId;
    const moduleId = req.params.moduleId;
    const enrollmentId = req.params.enrollmentId;

    // Assertain paid course enrollemnt exist with asociatted modules and content and try create progress
    let enrollment;
    enrollment = await EnrollmentModel.update({
      where: {
        id: enrollmentId,
        course: {
          modules: {
            some: {
              id: moduleId,
              content: {
                some: {
                  id: contentId,
                },
              },
            },
          },
        },
        payment: {
          complete: true,
        },
      },
      include: {
        course: {
          select: {
            modules: {
              select: { id: true, _count: { select: { content: true } } },
            },
          },
        },
        reviews: true,
        moduleProgress: {
          select: {
            // id: true,
            moduleId: true,
            _count: { select: { contents: true } },
            // contents: {
            //   select: {
            //     id: true,
            //     contentId: true,
            //     createdAt: true,
            //   },
            // },
            // createdAt: true,
          },
        },
      },
      data: {
        moduleProgress: {
          upsert: {
            where: {
              enrollmentId_moduleId: { enrollmentId, moduleId },
            },
            create: {
              moduleId,
              contents: {
                create: {
                  contentId,
                },
              },
            },
            update: {
              contents: {
                create: {
                  contentId,
                },
              },
            },
          },
        },
      },
    });

    // Calculate progress percentage
    const totalContents = enrollment.course.modules.reduce<number>(
      (acc, { _count: { content } }) => acc + content,
      0
    );
    const completedContents = enrollment.moduleProgress.reduce<number>(
      (acc, { _count: { contents } }) => acc + contents,
      0
    );
    const progressPercentage =
      totalContents > 0 ? (completedContents / totalContents) * 100 : 0.0;

    // Update progress percentage
    enrollment = await EnrollmentModel.update({
      where: {
        id: enrollmentId,
      },
      data: {
        progressPercentage,
      },
      include: {
        course: {
          include: {
            instructor: true,
            modules: {
              include: {
                content: true,
              },
            },
          },
        },
        moduleProgress: {
          select: {
            id: true,
            moduleId: true,
            contents: {
              select: {
                id: true,
                contentId: true,
                createdAt: true,
              },
            },
            createdAt: true,
            // _count: true,
          },
        },
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

    // Return updated enrollment with progresses
    return res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

export const downLoadCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enrollmentId = req.params.enrollmentId;
    const student = (req as any).user as User & {
      profile: Profile & { student: Student };
    };
    const enrollment = await EnrollmentModel.findUniqueOrThrow({
      where: {
        id: enrollmentId,
        studentId: student.profile.student.id,
        progressPercentage: {
          gte: 100,
        },
        course: {
          //Assert all course tests are attempted atleast once
          tests: {
            every: {
              attempts: {
                some: {
                  enrollmentId,
                },
              },
            },
          },
        },
      },
      include: {
        course: true,
      },
    });
    const html = await ejs.renderFile(
      path.join(process.cwd(), "assets", "certificate-template.ejs"),
      {
        studentName: student.profile.name,
        courseName: enrollment.course.title,
        signBase64: await readFile(
          path.join(process.cwd(), "assets", "signature.png"),
          { encoding: "base64" }
        ),
        frameBase64: await readFile(
          path.join(process.cwd(), "assets", "frame.png"),
          { encoding: "base64" }
        ),
        medalBase64: await readFile(
          path.join(process.cwd(), "assets", "medal.png"),
          { encoding: "base64" }
        ),
        congratsBase64: await readFile(
          path.join(process.cwd(), "assets", "congrats.png"),
          { encoding: "base64" }
        ),
      }
    );
    // return res.send(html);
    htmToPdf
      .create(html, {
        format: "A4",
        orientation: "portrait",
        border: { top: "2mm", right: "2mm", bottom: "2mm", left: "2mm" },
      })
      .toBuffer((err, buffer) => {
        if (err) {
          throw err;
        } else {
          // Set appropriate headers for PDF streaming
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="certificate.pdf"'
          );
          // Stream the PDF buffer directly to the response
          res.send(buffer);
        }
      });
  } catch (error) {
    next(error);
  }
};
