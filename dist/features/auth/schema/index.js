"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z
    .object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string(),
    password: zod_1.z.string().min(4),
    confirmPassword: zod_1.z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords dont match",
    path: ["confirmPassword"],
});
exports.LoginSchema = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string().min(4),
});
