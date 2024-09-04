"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attemptValidationSchema = exports.contentValidationSchema = exports.moduleValidationSchema = exports.courseValidationSchema = exports.topicValidationSchema = exports.courseTestValidationSchema = exports.testQuestionValidationSChema = exports.myCourseSearchSchema = exports.courseSearchSchema = void 0;
const zod_1 = require("zod");
exports.courseSearchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    language: zod_1.z.enum(["English", "Swahili"]).optional(),
    level: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    minPrice: zod_1.z.number({ coerce: true }).optional(),
    maxPrice: zod_1.z.number({ coerce: true }).optional(),
    minDuration: zod_1.z.number({ coerce: true }).optional(),
    maxDuration: zod_1.z.number({ coerce: true }).optional(),
    page: zod_1.z.number({ coerce: true }).min(1).optional().default(1),
    pageSize: zod_1.z.number({ coerce: true }).min(1).optional().default(10),
    rating: zod_1.z.number({ coerce: true }).optional(),
});
exports.myCourseSearchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    language: zod_1.z.enum(["English", "Swahili"]).optional(),
    level: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    minPrice: zod_1.z.number({ coerce: true }).optional(),
    maxPrice: zod_1.z.number({ coerce: true }).optional(),
    minDuration: zod_1.z.number({ coerce: true }).optional(),
    maxDuration: zod_1.z.number({ coerce: true }).optional(),
    page: zod_1.z.number({ coerce: true }).min(1).optional().default(1),
    pageSize: zod_1.z.number({ coerce: true }).min(1).optional().default(10),
    rating: zod_1.z.number({ coerce: true }).optional(),
    status: zod_1.z.enum(["Draft", "Published"]).optional(),
});
exports.testQuestionValidationSChema = zod_1.z.object({
    question: zod_1.z.string().min(1, "Required"),
    choices: zod_1.z
        .array(zod_1.z.object({
        choice: zod_1.z.string().min(1, "Required"),
        answer: zod_1.z.boolean().optional(),
    }))
        .nonempty("You must provide atleast one choice")
        .refine((choices) => choices.some((choice) => choice.answer === true), {
        message: "At least one choice must be marked as the correct answer",
    }),
});
exports.courseTestValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Required"),
    questions: zod_1.z.array(exports.testQuestionValidationSChema).optional().default([]),
});
exports.topicValidationSchema = zod_1.z.object({
    name: zod_1.z.string().max(191).min(1, "Topic name required"),
    overview: zod_1.z.string().optional(),
    thumbnail: zod_1.z.string().min(1, "Required"),
});
exports.courseValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title required"),
    overview: zod_1.z.string().min(1, "Title required"),
    language: zod_1.z.enum(["English", "Swahili"]),
    level: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]),
    status: zod_1.z.enum(["Draft", "Published"]),
    price: zod_1.z.number({ coerce: true }),
    timeToComplete: zod_1.z.number({ coerce: true }),
    previewVideo: zod_1.z.string().min(1, "Preview video required"),
    previewVideoSource: zod_1.z.enum(["file", "network", "youtube"]),
    thumbnail: zod_1.z.string().min(1, "Thumbnail required"),
    topics: zod_1.z.array(zod_1.z.string().uuid("Invalid topic")),
    tags: zod_1.z.string(),
});
exports.moduleValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title required"),
    overview: zod_1.z.string().min(10, "Overview too short").optional(),
    order: zod_1.z.number({ coerce: true }).min(-1).optional().default(-1),
});
exports.contentValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title required"),
    type: zod_1.z.enum(["Video", "Document", "Text", "Image"]),
    resource: zod_1.z.string().min(1, "Required"),
    order: zod_1.z.number({ coerce: true }).min(-1).optional().default(-1),
});
exports.attemptValidationSchema = zod_1.z.object({
    questions: zod_1.z.array(zod_1.z.object({
        question: zod_1.z.string().uuid("Invalid questions"),
        choices: zod_1.z
            .array(zod_1.z.string().uuid("Invalid choice"))
            .nonempty("You must provide atleast one choice"),
    })),
});
