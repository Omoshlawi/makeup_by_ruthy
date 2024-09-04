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
exports.getCourseReviews = exports.deleteReview = exports.updateReview = exports.postReview = void 0;
const exceprions_1 = require("../../../shared/exceprions");
const schema_1 = require("../schema");
const models_1 = require("../models");
const postReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const enrollmentId = req.params.enrollmentId;
        const validation = yield schema_1.reviewValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const student = req.user;
        const { comment, rating } = validation.data;
        // Update enrollment
        const enrollment = yield models_1.EnrollmentModel.update({
            where: { id: enrollmentId, studentId: student.profile.student.id },
            data: {
                reviews: {
                    create: {
                        rating,
                        comment,
                    },
                },
                course: {
                    update: {
                        averageRating: (_a = (yield models_1.CourseReviewModel.aggregate({
                            _avg: {
                                rating: true,
                            },
                            where: {
                                enrollmentId,
                            },
                        }))._avg.rating) !== null && _a !== void 0 ? _a : 0.0,
                    },
                },
            },
            include: {
                reviews: {
                    orderBy: { createdAt: "desc" },
                },
                course: true,
            },
        });
        return res.json(enrollment.reviews[0]);
    }
    catch (error) {
        next(error);
    }
});
exports.postReview = postReview;
const updateReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        const enrollmentId = req.params.enrollmentId;
        const validation = yield schema_1.reviewValidationSchema.safeParseAsync(req.body);
        if (!validation.success)
            throw new exceprions_1.APIException(400, validation.error.format());
        const student = req.user;
        const { comment, rating } = validation.data;
        // Update enrollment
        const enrollment = yield models_1.EnrollmentModel.findUniqueOrThrow({
            where: { id: enrollmentId, studentId: student.profile.student.id },
        });
        return res.json(yield models_1.CourseReviewModel.update({
            where: { id: reviewId, enrollmentId: enrollmentId },
            data: {
                rating,
                comment,
                enrollmentId: enrollment.id,
            },
        }));
    }
    catch (error) {
        next(error);
    }
});
exports.updateReview = updateReview;
const deleteReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviewId = req.params.reviewId;
        // Delete review ad update avg rating on course
        return res.json({ detail: "Review deleted succesfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReview = deleteReview;
const getCourseReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = req.params.courseId;
        const reviews = yield models_1.CourseReviewModel.findMany({
            where: {
                enrollment: {
                    courseId,
                },
            },
            include: {
                enrollment: {
                    include: {
                        student: {
                            include: {
                                profile: {
                                    include: {
                                        user: {
                                            select: {
                                                isAdmin: true,
                                                username: true,
                                                createdAt: true,
                                                updatedAt: true,
                                                id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return res.json({ results: reviews });
    }
    catch (error) {
        next(error);
    }
});
exports.getCourseReviews = getCourseReviews;
