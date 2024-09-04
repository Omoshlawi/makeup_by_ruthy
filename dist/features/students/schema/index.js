"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidationSchema = exports.progressValidationSchema = exports.enrollmentValidationShema = void 0;
const utils_1 = require("../../../utils");
const zod_1 = require("zod");
exports.enrollmentValidationShema = zod_1.z.object({
    phoneNumber: zod_1.z.string().regex(utils_1.PHONE_NUMBER_REGEX, {
        message: "Invalid phone number",
    }),
});
exports.progressValidationSchema = zod_1.z.object({
    module: zod_1.z.string().uuid("Invalid module"),
    content: zod_1.z.string().uuid("Invalid content"),
});
exports.reviewValidationSchema = zod_1.z.object({
    rating: zod_1.z.number(),
    comment: zod_1.z.string().min(1, "Invalid Comment").optional().nullable(),
});
