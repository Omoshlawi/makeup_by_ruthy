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
exports.deleteTest = exports.updateTest = exports.addTest = exports.getTest = exports.getTests = void 0;
const exceprions_1 = require("../../../shared/exceprions");
const models_1 = require("../models");
const schema_1 = require("../schema");
const getTests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const moduleId = req.params.moduleId;
        const courseId = req.params.courseId;
        return res.json({
            results: yield models_1.TestModel.findMany({
                where: {
                    courseId: isModuleTest ? undefined : courseId,
                    moduleId: isModuleTest ? moduleId : undefined,
                },
                include: models_1.courseInclude.tests.include,
            }),
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getTests = getTests;
const getTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const moduleId = req.params.moduleId;
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        return res.json(yield models_1.TestModel.findUniqueOrThrow({
            where: {
                courseId: isModuleTest ? undefined : courseId,
                id: testId,
                moduleId: isModuleTest ? moduleId : undefined,
            },
            include: models_1.courseInclude.tests.include,
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.getTest = getTest;
const addTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const moduleId = req.params.moduleId;
        const courseId = req.params.courseId;
        const validation = yield schema_1.courseTestValidationSchema.safeParseAsync(req.body);
        const user = req.user;
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { questions, title } = validation.data;
        // Create Test, Questions, and Choices in a single Prisma statement
        const course = yield models_1.CourseModel.update({
            where: {
                id: courseId,
                instructorId: user.profile.instructor.id,
                modules: isModuleTest
                    ? {
                        some: {
                            id: moduleId,
                        },
                    }
                    : undefined,
            },
            data: {
                tests: isModuleTest
                    ? undefined
                    : {
                        create: {
                            title,
                            questions: {
                                create: questions.map(({ question, choices }) => ({
                                    question,
                                    choices: {
                                        create: choices.map(({ choice, answer }) => ({
                                            choice,
                                            answer,
                                        })),
                                    },
                                })),
                            },
                        },
                    },
                modules: !isModuleTest
                    ? undefined
                    : {
                        update: {
                            where: { id: moduleId },
                            data: {
                                tests: {
                                    create: {
                                        title,
                                        questions: {
                                            create: questions.map(({ question, choices }) => ({
                                                question,
                                                choices: {
                                                    create: choices.map(({ choice, answer }) => ({
                                                        choice,
                                                        answer,
                                                    })),
                                                },
                                            })),
                                        },
                                    },
                                },
                            },
                        },
                    },
            },
            include: models_1.courseInclude,
        });
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.addTest = addTest;
const updateTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const moduleId = req.params.moduleId;
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        const validation = yield schema_1.courseTestValidationSchema.safeParseAsync(req.body);
        const user = req.user;
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { title } = validation.data;
        const course = yield models_1.CourseModel.update({
            where: {
                id: courseId,
                instructorId: user.profile.instructor.id,
                tests: isModuleTest
                    ? undefined
                    : {
                        some: { id: testId },
                    },
                modules: isModuleTest
                    ? {
                        some: {
                            id: moduleId,
                            tests: {
                                some: {
                                    id: testId,
                                },
                            },
                        },
                    }
                    : undefined,
            },
            data: {
                tests: isModuleTest
                    ? undefined
                    : {
                        update: {
                            where: { id: testId },
                            data: {
                                title,
                            },
                        },
                    },
                modules: isModuleTest
                    ? {
                        update: {
                            where: { id: moduleId },
                            data: {
                                tests: {
                                    update: {
                                        where: { id: testId },
                                        data: { title },
                                    },
                                },
                            },
                        },
                    }
                    : undefined,
            },
            include: models_1.courseInclude,
        });
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTest = updateTest;
const deleteTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const moduleId = req.params.moduleId;
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        const user = req.user;
        const course = yield models_1.CourseModel.update({
            where: {
                id: courseId,
                instructorId: user.profile.instructor.id,
                tests: isModuleTest
                    ? undefined
                    : {
                        some: { id: testId },
                    },
                modules: isModuleTest
                    ? {
                        some: {
                            id: moduleId,
                            tests: {
                                some: {
                                    id: testId,
                                },
                            },
                        },
                    }
                    : undefined,
            },
            data: {
                tests: isModuleTest
                    ? undefined
                    : {
                        delete: { id: testId },
                    },
                modules: isModuleTest
                    ? {
                        update: {
                            where: { id: moduleId },
                            data: {
                                tests: {
                                    delete: { id: testId },
                                },
                            },
                        },
                    }
                    : undefined,
            },
            include: models_1.courseInclude,
        });
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTest = deleteTest;