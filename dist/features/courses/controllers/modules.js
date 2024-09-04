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
exports.deleteCourseModule = exports.updateCourseModule = exports.addCourseModule = void 0;
const schema_1 = require("../schema");
const exceprions_1 = require("../../../shared/exceprions");
const models_1 = require("../models");
const addCourseModule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const courseId = req.params.courseId;
        const validation = yield schema_1.moduleValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        if (yield models_1.CourseModuleModel.findFirst({
            where: { courseId, title: validation.data.title },
        }))
            throw new exceprions_1.APIException(400, {
                title: { errors: ["Modules title for a course must be unique"] },
            });
        // TODO Handle module Orders later
        const course = yield models_1.CourseModel.update({
            where: {
                id: courseId,
                instructor: { profile: { userId: user.id } },
            },
            data: {
                modules: {
                    create: validation.data,
                },
            },
            include: {
                _count: true,
                instructor: true,
                modules: { include: { content: true } },
                topics: { include: { topic: true } },
            },
        });
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.addCourseModule = addCourseModule;
const updateCourseModule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const courseId = req.params.courseId;
        const moduleId = req.params.id;
        const validation = yield schema_1.moduleValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        if (yield models_1.CourseModuleModel.findFirst({
            where: {
                courseId,
                title: validation.data.title,
                id: { not: moduleId },
            },
        }))
            throw new exceprions_1.APIException(400, {
                title: { errors: ["Modules title for a course must be unique"] },
            });
        const course = yield models_1.CourseModel.update({
            where: {
                id: courseId,
                modules: { some: { id: moduleId } },
                instructor: { profile: { userId: user.id } },
            },
            data: {
                modules: {
                    update: {
                        data: validation.data,
                        where: { id: moduleId },
                    },
                },
            },
            include: {
                _count: true,
                instructor: true,
                modules: { include: { content: true } },
                topics: { include: { topic: true } },
            },
        });
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCourseModule = updateCourseModule;
const deleteCourseModule = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const courseId = req.params.courseId;
        const moduleId = req.params.id;
        const course = yield models_1.CourseModel.update({
            where: {
                id: courseId,
                modules: { some: { id: moduleId } },
                instructor: { profile: { userId: user.id } },
            },
            data: {
                modules: {
                    delete: { id: moduleId },
                },
            },
            include: {
                _count: true,
                instructor: true,
                modules: { include: { content: true } },
                topics: { include: { topic: true } },
            },
        });
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCourseModule = deleteCourseModule;
