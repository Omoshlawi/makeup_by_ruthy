"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePrismaErrors = exports.ERROR_CODES = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const globalForPrisma = global;
exports.prisma = globalForPrisma.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = exports.prisma;
exports.default = exports.prisma;
exports.ERROR_CODES = Object.freeze({
    NOT_FOUND: "P2025",
    UNIQUE_CONTRAINT_FAILED: "P2002",
    RELATED_RECODE_NOT_FOUND: "P2015",
    TOO_MANY_DB_CONNECTION_OPEN: "P2037",
});
const handlePrismaErrors = (e) => {
    var _a;
    if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // console.log(
        //   "--------------------------------------->",
        //   e.code,
        //   // e.message,
        //   e.meta,
        //   e.name
        // );
        if (e.code === exports.ERROR_CODES.NOT_FOUND) {
            if ((_a = e.meta) === null || _a === void 0 ? void 0 : _a.cause)
                return { status: 404, errors: { detail: e.meta.cause } };
            return { status: 404, errors: { detail: e.message } };
        }
        else if (e.code === exports.ERROR_CODES.UNIQUE_CONTRAINT_FAILED) {
            const taget = e.meta.target;
            const fieldName = taget.split("_").slice(1, -1).join("_");
            return {
                status: 400,
                errors: { [fieldName]: { _errors: ["Must be unique"] } },
            };
        }
    }
};
exports.handlePrismaErrors = handlePrismaErrors;
