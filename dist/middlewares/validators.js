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
exports.validateIPAddress = exports.validateUUIDPathParam = void 0;
const exceprions_1 = require("../shared/exceprions");
const helpers_1 = require("../utils/helpers");
const zod_1 = require("zod");
const validateUUIDPathParam = (paramName) => (req, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req;
        if (!zod_1.z.string().uuid().safeParse(req.params[paramName]).success)
            throw { status: 404, errors: { detail: "Not found" } };
        return next();
    }
    catch (error) {
        return next(error);
    }
});
exports.validateUUIDPathParam = validateUUIDPathParam;
const validateIPAddress = (allowedIpAddresses) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const requestIp = (0, helpers_1.normalizeIp)((_a = (req.ip || req.socket.remoteAddress || req.connection.remoteAddress)) !== null && _a !== void 0 ? _a : "");
    // Check if the request IP is in the allowed list
    if (!requestIp || !allowedIpAddresses.includes(requestIp)) {
        return next(new exceprions_1.APIException(403, { detail: "Forbidden: Access is denied." }));
    }
    return next();
});
exports.validateIPAddress = validateIPAddress;
