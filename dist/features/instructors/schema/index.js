"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorSearchSchema = void 0;
const zod_1 = require("zod");
exports.instructorSearchSchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    page: zod_1.z.number({ coerce: true }).min(1).optional().default(1),
    pageSize: zod_1.z.number({ coerce: true }).min(1).optional().default(10),
    rating: zod_1.z.number({ coerce: true }).optional(),
});
