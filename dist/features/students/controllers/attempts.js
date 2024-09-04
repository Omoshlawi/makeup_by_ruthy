"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestAttempts = exports.addTestAttempts = exports.getTestAttempts = void 0;
const models_1 = require("../../courses/models");
const schema_1 = require("../../courses/schema");
const exceprions_1 = require("../../../shared/exceprions");
const models_2 = require("../models");
const getTestAttempts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollmentId = req.params.enrollmentId;
        const testId = req.params.testId;
        const user = req.user;
        return res.json({
            results: yield models_1.TestModel.findMany({
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
    }
    catch (error) {
        next(error);
    }
});
exports.getTestAttempts = getTestAttempts;
const addTestAttempts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollmentId = req.params.enrollmentId;
        const testId = req.params.testId;
        const user = req.user;
        const validation = yield schema_1.attemptValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { questions } = validation.data;
        const questionAttempts = questions.reduce((prev, curr) => [
            ...prev,
            ...curr.choices.map((ch) => ({
                choiceId: ch,
                questionId: curr.question,
            })),
        ], []);
        // Assert test exist
        const test = yield models_1.TestModel.findFirstOrThrow({
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
        const sameQuizes = test.questions.every((quiz) => questions.findIndex((q) => q.question === quiz.id &&
            q.choices.every((ch) => quiz.choices.findIndex((c) => c.id === ch) !== -1)) !== -1) && test.questions.length === questions.length;
        if (!sameQuizes)
            throw new exceprions_1.APIException(400, {
                _errors: ["Rsponses not matching with questions and choices"],
            });
        // Calculate score
        const score = questions.reduce((prev, curr) => {
            const q = test.questions.find((q) => q.id === curr.question);
            const correctChoices = q.choices.filter((ch) => ch.answer);
            const isCorrect = correctChoices.every((c) => curr.choices.includes(c.id));
            if (isCorrect)
                return prev + 1;
            return prev;
        }, 0);
        // Create an attempt with score
        const createdAttempt = yield models_1.TestModel.update({
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
        });
        return res.json(yield models_2.EnrollmentModel.findFirstOrThrow({
            where: { id: enrollmentId },
            include: models_1.enrollmentInclude,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.addTestAttempts = addTestAttempts;
const deleteTestAttempts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const enrollmentId = req.params.enrollmentId;
        const testId = req.params.testId;
        const attemptId = req.params.attemptId;
        const user = req.user;
        const test = yield models_1.TestModel.update({
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
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTestAttempts = deleteTestAttempts;
