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
exports.deleteModuleContent = exports.updateModuleContent = exports.addModuleContent = void 0;
const schema_1 = require("../schema");
const exceprions_1 = require("../../../shared/exceprions");
const models_1 = require("../models");
const db_1 = require("../../../services/db");
const addModuleContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const courseId = req.params.courseId;
        const moduleId = req.params.moduleId;
        const validation = yield schema_1.contentValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        if (yield models_1.ContentModel.findFirst({
            where: { moduleId, title: validation.data.title },
        }))
            throw new exceprions_1.APIException(400, {
                title: { errors: ["Content title for a module must be unique"] },
            });
        // TODO Handle content Orders later
        const course = yield models_1.CourseModel.update(Object.assign({ where: {
                id: courseId,
                instructor: { profile: { userId: user.id } },
                modules: { some: { id: moduleId } },
            }, data: {
                modules: {
                    update: {
                        where: { id: moduleId },
                        data: {
                            content: {
                                create: validation.data,
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
exports.addModuleContent = addModuleContent;
const updateModuleContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const courseId = req.params.courseId;
        const moduleId = req.params.moduleId;
        const contentId = req.params.id;
        const validation = yield schema_1.contentValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        if (yield models_1.ContentModel.findFirst({
            where: {
                moduleId,
                title: validation.data.title,
                id: { not: contentId },
            },
        }))
            throw new exceprions_1.APIException(400, {
                title: { errors: ["Content title for a module must be unique"] },
            });
        // TODO Handle content Orders later
        const course = yield models_1.CourseModel.update(Object.assign({ where: {
                id: courseId,
                instructor: { profile: { userId: user.id } },
                modules: {
                    some: { id: moduleId, content: { some: { id: contentId } } },
                },
            }, data: {
                modules: {
                    update: {
                        where: { id: moduleId },
                        data: {
                            content: {
                                update: {
                                    where: { id: contentId },
                                    data: validation.data,
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
exports.updateModuleContent = updateModuleContent;
const deleteModuleContent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const courseId = req.params.courseId;
        const moduleId = req.params.moduleId;
        const contentId = req.params.id;
        const course = yield models_1.CourseModel.update(Object.assign({ where: {
                id: courseId,
                instructor: { profile: { userId: user.id } },
                modules: {
                    some: { id: moduleId, content: { some: { id: contentId } } },
                },
            }, data: {
                modules: {
                    update: {
                        where: { id: moduleId },
                        data: {
                            content: {
                                delete: { id: contentId },
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
exports.deleteModuleContent = deleteModuleContent;
