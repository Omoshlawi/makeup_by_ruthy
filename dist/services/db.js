"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileds = exports.paginate = exports.handlePrismaErrors = exports.ERROR_CODES = exports.prisma = void 0;
exports.parseCustomRepresentation = parseCustomRepresentation;
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
function parseCustomRepresentation(customRep) {
    var _a;
    const mode = (_a = customRep === null || customRep === void 0 ? void 0 : customRep.split(":")[0]) === null || _a === void 0 ? void 0 : _a.trim();
    if (!["include", "select"].includes(mode))
        return;
    // Helper function to parse nested properties
    function parseFields(fields) {
        const result = {};
        let currentKey = "";
        let depth = 0;
        let nested = "";
        for (let char of fields) {
            if (char === "(") {
                depth++;
                if (depth === 1) {
                    continue;
                }
            }
            else if (char === ")") {
                depth--;
                if (depth === 0) {
                    result[currentKey.trim()] = { [mode]: parseFields(nested) };
                    currentKey = "";
                    nested = "";
                    continue;
                }
            }
            if (depth > 0) {
                nested += char;
            }
            else if (char === ",") {
                if (currentKey.trim()) {
                    result[currentKey.trim()] = true; // Simple field
                }
                currentKey = "";
            }
            else {
                currentKey += char;
            }
        }
        if (currentKey.trim()) {
            result[currentKey.trim()] = true; // Last simple field
        }
        return result;
    }
    const parsedFields = parseFields(customRep);
    function processObject(obj) {
        const processedObj = {};
        for (const key in obj) {
            if (typeof obj[key] === "object") {
                processedObj[key.endsWith(":") ? key.slice(0, -1) : key] =
                    processObject(obj[key]);
            }
            else {
                processedObj[key] = obj[key];
            }
        }
        return processedObj;
    }
    return processObject(parsedFields)[mode][mode];
}
const paginate = (pageSize, page) => (page - 1) * pageSize;
exports.paginate = paginate;
const getFileds = (v) => ({
    include: (v === null || v === void 0 ? void 0 : v.startsWith("include:"))
        ? parseCustomRepresentation(v !== null && v !== void 0 ? v : "")
        : undefined,
    select: (v === null || v === void 0 ? void 0 : v.startsWith("select:"))
        ? parseCustomRepresentation(v !== null && v !== void 0 ? v : "")
        : undefined,
});
exports.getFileds = getFileds;
