import { NextFunction, Request, Response } from "express";
import { TestAttemptModel, TestModel } from "../../courses/models";
import { Profile, Student, User } from "@prisma/client";
import { attemptValidationSchema } from "../../courses/schema";
import { APIException } from "@/shared/exceprions";

export const getTestAttempts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const enrollmentId = req.params.enrollmentId;
    const testId = req.params.testId;

    const user: User & { profile: Profile & { student: Student } } = (
      req as any
    ).user;

    return res.json({
      results: await TestModel.findMany({
        where: {
          id: testId,
          course: {
            enrollments: {
              some: {
                id: enrollmentId,
                studentId: user.profile.student.id,
              },
            },
          },
        },
        include: {
          questions: {
            include: {
              choices: true,
            },
          },
          attempts: {
            include: {
              attemptQuestions: {
                include: { choice: true, question: true },
              },
              enrollement: true,
            },
          },
        },
      }),
    });
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
    const enrollmentId = req.params.enrollmentId;
    const testId = req.params.testId;

    const user: User & { profile: Profile & { student: Student } } = (
      req as any
    ).user;

    const validation = await attemptValidationSchema.safeParseAsync(req.body);
    if (!validation.success)
      throw new APIException(400, validation.error.format());
    const { questions } = validation.data;

    const questionAttempts = questions.reduce<
      { questionId: string; choiceId: string }[]
    >(
      (prev, curr) => [
        ...prev,
        ...curr.choices.map((ch) => ({
          choiceId: ch,
          questionId: curr.question,
        })),
      ],
      []
    );
    // Assert test exist
    const test = await TestModel.findFirstOrThrow({
      where: {
        id: testId,
        course: {
          enrollments: {
            some: {
              id: enrollmentId,
              studentId: user.profile.student.id,
            },
          },
        },
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
      },
    });

    //  Assert Questions are same and responses are all in the test choices
    const sameQuizes =
      test.questions.every(
        (quiz) =>
          questions.findIndex(
            (q) =>
              q.question === quiz.id &&
              q.choices.every(
                (ch) => quiz.choices.findIndex((c) => c.id === ch) !== -1
              )
          ) !== -1
      ) && test.questions.length === questions.length;

    if (!sameQuizes)
      throw new APIException(400, {
        _errors: ["Rsponses not matching with questions and choices"],
      });

    // Calculate score
    const score = questions.reduce((prev, curr) => {
      const q = test.questions.find((q) => q.id === curr.question)!;
      const correctChoices = q.choices.filter((ch) => ch.answer);
      const isCorrect = correctChoices.every((c) =>
        curr.choices.includes(c.id)
      );
      if (isCorrect) return prev + 1;
      return prev;
    }, 0);

    // Create an attempt with score
    const createdAttempt = await TestModel.update({
      where: {
        id: testId,
      },
      data: {
        attempts: {
          create: {
            score: (score / questions.length) * 100,
            enrollmentId: enrollmentId,
            attemptQuestions: {
              createMany: {
                skipDuplicates: true,
                data: questionAttempts,
              },
            },
          },
        },
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
        attempts: {
          include: {
            attemptQuestions: {
              include: { choice: true, question: true },
            },
            enrollement: true,
          },
        },
      },
    });

    return res.json(createdAttempt);
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
    const enrollmentId = req.params.enrollmentId;
    const testId = req.params.testId;
    const attemptId = req.params.attemptId;

    const user: User & { profile: Profile & { student: Student } } = (
      req as any
    ).user;

    const test = await TestModel.update({
      where: {
        id: testId,
        course: {
          enrollments: {
            some: {
              id: enrollmentId,
              studentId: user.profile.student.id,
            },
          },
        },
        attempts: {
          some: {
            id: attemptId,
          },
        },
      },
      data: {
        attempts: {
          delete: {
            id: attemptId,
          },
        },
      },
      include: {
        questions: {
          include: {
            choices: true,
          },
        },
        attempts: {
          include: {
            attemptQuestions: {
              include: { choice: true, question: true },
            },
            enrollement: true,
          },
        },
      },
    });

    return res.json(test);
  } catch (error) {
    console.log(error);

    next(error);
  }
};
