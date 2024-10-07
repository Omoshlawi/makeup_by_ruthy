"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearchSchema = exports.accountSetupSchema = exports.ProfileSchema = void 0;
const zod_1 = require("zod");
exports.ProfileSchema = zod_1.z.object({
    name: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string(),
    gender: zod_1.z.enum(["Male", "Female"]),
});
exports.accountSetupSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    username: zod_1.z.string(),
    bio: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string(),
    gender: zod_1.z.enum(["Male", "Female"]),
    avatarUrl: zod_1.z.string(),
    userType: zod_1.z.enum(["Student", "Instructor"]),
    experience: zod_1.z.number({ coerce: true }).optional(),
    areasOfInterest: zod_1.z
        .array(zod_1.z.string().uuid({ message: "Invalid area of interest" }))
        .optional()
        .default([]),
    specialities: zod_1.z
        .array(zod_1.z.string().uuid({ message: "Invalid area of specialities" }))
        .optional()
        .default([]),
    skillLevel: zod_1.z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    instagram: zod_1.z.string().url().optional(),
    facebook: zod_1.z.string().url().optional(),
    twitter: zod_1.z.string().url().optional(),
    linkedin: zod_1.z.string().url().optional(),
    youtube: zod_1.z.string().url().optional(),
    tiktok: zod_1.z.string().url().optional(),
})
    .refine((data) => !(data.userType == "Instructor" && !data.specialities), {
    message: "Specialities required",
    path: ["specialities"],
})
    .refine((data) => !(data.userType == "Instructor" &&
    (data.experience === null || data.experience == undefined)), {
    message: "Expirience required",
    path: ["experience"],
})
    .refine((data) => !(data.userType == "Student" &&
    (data.skillLevel === null || data.skillLevel == undefined)), {
    message: "Current skill level required",
    path: ["skillLevel"],
})
    .refine((data) => !(data.userType == "Student" && !data.areasOfInterest), {
    message: "Areas of interest required",
    path: ["areasOfInterest"],
});
exports.userSearchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    page: zod_1.z.number({ coerce: true }).min(1).optional().default(1),
    pageSize: zod_1.z.number({ coerce: true }).min(1).optional().default(10),
    includeAll: zod_1.z.string().optional(),
});
