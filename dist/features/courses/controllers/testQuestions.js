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
exports.deleteTestQuestions = exports.updateTestQuestions = exports.addTestQuestion = exports.getTestQuestion = exports.getTestQuestions = void 0;
const models_1 = require("../models");
const schema_1 = require("../schema");
const exceprions_1 = require("../../../shared/exceprions");
const db_1 = require("../../../services/db");
const getTestQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        const questions = yield models_1.TestQuestionModel.findMany(Object.assign({ where: {
                testId,
            } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json({ results: questions });
    }
    catch (error) {
        next(error);
    }
});
exports.getTestQuestions = getTestQuestions;
const getTestQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        return res.json({ results: req.params });
    }
    catch (error) {
        next(error);
    }
});
exports.getTestQuestion = getTestQuestion;
const addTestQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        const moduleId = req.params.moduleId;
        const isModuleTest = req.originalUrl.includes("modules");
        const user = req.user;
        const validation = yield schema_1.testQuestionValidationSChema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { choices, question } = validation.data;
        const course = yield models_1.CourseModel.update(Object.assign({ where: {
                id: courseId,
                instructorId: user.profile.instructor.id,
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
                tests: isModuleTest
                    ? undefined
                    : {
                        some: {
                            id: testId,
                        },
                    },
            }, data: {
                tests: isModuleTest
                    ? undefined
                    : {
                        update: {
                            where: { id: testId },
                            data: {
                                questions: {
                                    create: {
                                        question,
                                        choices: {
                                            createMany: {
                                                skipDuplicates: true,
                                                data: choices,
                                            },
                                        },
                                    },
                                },
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
                                        data: {
                                            questions: {
                                                create: {
                                                    question,
                                                    choices: {
                                                        createMany: {
                                                            skipDuplicates: true,
                                                            data: choices,
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                    : undefined,
            } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.addTestQuestion = addTestQuestion;
const updateTestQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // NOTE: Does not delete choices wrather updates or creates if dont exist
        const isModuleTest = req.originalUrl.includes("modules");
        const questionId = req.params.questionId;
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        const moduleId = req.params.moduleId;
        const user = req.user;
        const validation = yield schema_1.testQuestionValidationSChema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { choices, question } = validation.data;
        const course = yield models_1.CourseModel.update(Object.assign({ where: {
                id: courseId,
                instructorId: user.profile.instructor.id,
                modules: isModuleTest
                    ? {
                        some: {
                            id: moduleId,
                            tests: {
                                some: {
                                    id: testId,
                                    questions: {
                                        some: {
                                            id: questionId,
                                        },
                                    },
                                },
                            },
                        },
                    }
                    : undefined,
                tests: isModuleTest
                    ? undefined
                    : {
                        some: {
                            id: testId,
                            questions: {
                                some: {
                                    id: questionId,
                                },
                            },
                        },
                    },
            }, data: {
                tests: isModuleTest
                    ? undefined
                    : {
                        update: {
                            where: { id: testId },
                            data: {
                                questions: {
                                    update: {
                                        where: { id: questionId },
                                        data: {
                                            question,
                                            choices: {
                                                deleteMany: {
                                                    questionId,
                                                },
                                                createMany: { skipDuplicates: true, data: choices },
                                            },
                                        },
                                    },
                                },
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
                                        data: {
                                            questions: {
                                                update: {
                                                    where: { id: questionId },
                                                    data: {
                                                        question,
                                                        choices: {
                                                            deleteMany: {
                                                                questionId,
                                                            },
                                                            createMany: {
                                                                skipDuplicates: true,
                                                                data: choices,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    }
                    : undefined,
            } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTestQuestions = updateTestQuestions;
const deleteTestQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const isModuleTest = req.originalUrl.includes("modules");
        const questionId = req.params.questionId;
        const courseId = req.params.courseId;
        const testId = req.params.testId;
        const moduleId = req.params.moduleId;
        const user = req.user;
        const course = yield models_1.CourseModel.update(Object.assign({ where: {
                id: courseId,
                instructorId: user.profile.instructor.id,
                modules: isModuleTest
                    ? {
                        some: {
                            id: moduleId,
                            tests: {
                                some: {
                                    id: testId,
                                    questions: {
                                        some: {
                                            id: questionId,
                                        },
                                    },
                                },
                            },
                        },
                    }
                    : undefined,
                tests: isModuleTest
                    ? undefined
                    : {
                        some: {
                            id: testId,
                            questions: {
                                some: {
                                    id: questionId,
                                },
                            },
                        },
                    },
            }, data: {
                tests: isModuleTest
                    ? undefined
                    : {
                        update: {
                            where: { id: testId },
                            data: {
                                questions: {
                                    delete: {
                                        id: questionId,
                                    },
                                },
                            },
                        },
                    },
                modules: {
                    update: {
                        where: { id: moduleId },
                        data: {
                            tests: {
                                update: {
                                    where: { id: testId },
                                    data: {
                                        questions: {
                                            delete: {
                                                id: questionId,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTestQuestions = deleteTestQuestions;
