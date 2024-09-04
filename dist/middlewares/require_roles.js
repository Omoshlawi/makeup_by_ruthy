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
exports.requireAdmin = exports.requireStudent = exports.requireInstructor = void 0;
const models_1 = require("../features/users/models");
const exceprions_1 = require("../shared/exceprions");
const requireInstructor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const instructor = yield models_1.UserModel.findUnique({
            where: { id: user.id, profile: { instructor: { isNot: null } } },
            include: { profile: { include: { instructor: true } } },
        });
        if (!instructor) {
            throw new exceprions_1.APIException(403, {
                detail: "Must be a instructor to access resource",
            });
        }
        req.user = instructor;
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireInstructor = requireInstructor;
const requireStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const instructor = yield models_1.UserModel.findUnique({
            where: { id: user.id, profile: { student: { isNot: null } } },
            include: { profile: { include: { student: true } } },
        });
        if (!instructor) {
            throw new exceprions_1.APIException(403, {
                detail: "Must be a student to access resource",
            });
        }
        req.user = instructor;
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireStudent = requireStudent;
const requireAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user.isAdmin) {
            throw new exceprions_1.APIException(403, {
                detail: "Must be an admin to access resource",
            });
        }
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.requireAdmin = requireAdmin;
