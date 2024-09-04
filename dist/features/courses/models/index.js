"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrollmentInclude = exports.courseInclude = exports.TestAttemptQuestionModel = exports.TestAttemptModel = exports.TestQuestionChoiceModel = exports.TestQuestionModel = exports.TestModel = exports.TopicsMddel = exports.ContentModel = exports.CourseModuleModel = exports.CourseModel = void 0;
const db_1 = __importDefault(require("../../../services/db"));
exports.CourseModel = db_1.default.course;
exports.CourseModuleModel = db_1.default.module;
exports.ContentModel = db_1.default.content;
exports.TopicsMddel = db_1.default.topic;
exports.TestModel = db_1.default.test;
exports.TestQuestionModel = db_1.default.testQuestion;
exports.TestQuestionChoiceModel = db_1.default.testQuestionChoice;
exports.TestAttemptModel = db_1.default.testAttempt;
exports.TestAttemptQuestionModel = db_1.default.testAttemptQuestion;
exports.courseInclude = {
    tests: {
        include: {
            questions: {
                include: {
                    choices: true,
                },
            },
        },
    },
    instructor: true,
    modules: {
        include: {
            content: true,
            tests: {
                include: {
                    questions: {
                        include: {
                            choices: true,
                        },
                    },
                },
            },
        },
    },
    topics: { include: { topic: true } },
};
exports.enrollmentInclude = {
    course: { include: exports.courseInclude },
    attempts: {
        include: {
            attemptQuestions: true,
        },
    },
    reviews: true,
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
};
