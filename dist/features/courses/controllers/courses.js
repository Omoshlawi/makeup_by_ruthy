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
exports.deleteCourse = exports.updateCourse = exports.addCourse = exports.getCourse = exports.getMyCourses = exports.getCourses = exports.toggleCourseApproval = void 0;
const models_1 = require("../models");
const exceprions_1 = require("../../../shared/exceprions");
const schema_1 = require("../schema");
const db_1 = require("../../../services/db");
const toggleCourseApproval = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const action = req.params.action;
        if (!["approve", "disapprove"].includes(action))
            throw new exceprions_1.APIException(404, { detail: "Not found" });
        yield models_1.CourseModel.update({
            where: { id: courseId, approved: action !== "approve" },
            data: { approved: action === "approve" },
        });
        return res.json({ detail: `Course ${action} successfull!` });
    }
    catch (error) {
        next(error);
    }
});
exports.toggleCourseApproval = toggleCourseApproval;
const getCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = yield schema_1.courseSearchSchema.safeParseAsync(req.query);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const { language, level, maxDuration, minDuration, maxPrice, minPrice, search, page, pageSize, rating, includeAll, v, } = validation.data;
        const include = includeAll === null || includeAll === void 0 ? void 0 : includeAll.trim().split(",");
        const courses = yield models_1.CourseModel.findMany(Object.assign({ where: {
                AND: [
                    {
                        language,
                        level,
                        timeToComplete: { gte: minDuration, lte: maxDuration },
                        price: { gte: minPrice, lte: maxPrice },
                        averageRating: { gte: rating, lt: rating ? rating + 1 : undefined },
                        approved: (include === null || include === void 0 ? void 0 : include.includes("unapproved")) ? undefined : true,
                        status: "Published",
                    },
                    {
                        OR: search
                            ? [
                                {
                                    title: {
                                        contains: search,
                                    },
                                },
                                {
                                    overview: {
                                        contains: search,
                                    },
                                },
                                {
                                    instructor: {
                                        profile: {
                                            OR: [
                                                { email: search },
                                                { phoneNumber: search },
                                                { name: search },
                                            ],
                                        },
                                    },
                                },
                            ]
                            : undefined,
                    },
                ],
            }, skip: (0, db_1.paginate)(pageSize, page), take: pageSize, orderBy: { createdAt: "asc" } }, (0, db_1.getFileds)(v)));
        return res.json({ results: courses });
    }
    catch (error) {
        return next(error);
    }
});
exports.getCourses = getCourses;
const getMyCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validation = yield schema_1.myCourseSearchSchema.safeParseAsync(req.query);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const user = req.user;
        const { language, level, maxDuration, minDuration, maxPrice, minPrice, search, page, pageSize, rating, status, } = validation.data;
        const courses = yield models_1.CourseModel.findMany(Object.assign({ where: {
                AND: [
                    {
                        instructorId: user.profile.instructor.id,
                        status,
                        language,
                        level,
                        timeToComplete: { gte: minDuration, lte: maxDuration },
                        price: { gte: minPrice, lte: maxPrice },
                        averageRating: { gte: rating, lt: rating ? rating + 1 : undefined },
                    },
                    {
                        OR: search
                            ? [
                                {
                                    title: {
                                        contains: search,
                                    },
                                },
                                {
                                    overview: {
                                        contains: search,
                                    },
                                },
                                {
                                    instructor: {
                                        profile: {
                                            OR: [
                                                { email: search },
                                                { phoneNumber: search },
                                                { name: search },
                                            ],
                                        },
                                    },
                                },
                            ]
                            : undefined,
                    },
                ],
            }, skip: (0, db_1.paginate)(pageSize, page), take: pageSize, orderBy: { createdAt: "asc" } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json({ results: courses });
    }
    catch (error) {
        return next(error);
    }
});
exports.getMyCourses = getMyCourses;
const getCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const course = yield models_1.CourseModel.findUniqueOrThrow(Object.assign({ where: { id: req.params.id } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.getCourse = getCourse;
const addCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const validation = yield schema_1.courseValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const topic = yield models_1.CourseModel.create(Object.assign(Object.assign({}, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")), { data: Object.assign(Object.assign({}, Object.assign(Object.assign({}, validation.data), { previewVideoSource: undefined, previewVideo: {
                    url: validation.data.previewVideo,
                    source: validation.data.previewVideoSource,
                } })), { instructorId: user.profile.instructor.id, topics: {
                    createMany: {
                        skipDuplicates: true,
                        data: validation.data.topics.map((tag) => ({ topicId: tag })),
                    },
                } }) }));
        return res.json(topic);
    }
    catch (error) {
        next(error);
    }
});
exports.addCourse = addCourse;
const updateCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req.user;
        const validation = yield schema_1.courseValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const topic = yield models_1.CourseModel.update(Object.assign(Object.assign({}, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")), { data: Object.assign(Object.assign({}, Object.assign(Object.assign({}, validation.data), { previewVideoSource: undefined, previewVideo: {
                    url: validation.data.previewVideo,
                    source: validation.data.previewVideoSource,
                } })), { topics: {
                    deleteMany: { courseId: req.params.id },
                    createMany: {
                        skipDuplicates: true,
                        data: validation.data.topics.map((topic) => ({ topicId: topic })),
                    },
                } }), where: {
                id: req.params.id,
                instructor: { profile: { userId: user.id } },
            } }));
        return res.json(topic);
    }
    catch (error) {
        next(error);
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const topic = yield models_1.CourseModel.delete(Object.assign({ where: { id: req.params.id } }, (0, db_1.getFileds)((_a = req.query.v) !== null && _a !== void 0 ? _a : "")));
        return res.json(topic);
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCourse = deleteCourse;
