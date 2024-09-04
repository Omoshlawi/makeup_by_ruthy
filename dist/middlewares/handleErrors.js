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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = handleErrors;
const db_1 = require("../services/db");
const logger_1 = __importDefault(require("../shared/logger"));
const tasks_1 = require("../shared/tasks");
function handleErrors(error, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, tasks_1.executeRollBackTasks)(req);
        if (error.status) {
            return res.status(error.status).json(error.errors);
        }
        const errors = (0, db_1.handlePrismaErrors)(error);
        if (errors)
            return res.status(errors.status).json(errors.errors);
        logger_1.default.error("Error handler middleware: " + error.message);
        return res.status(500).json({ detail: "Internal Server Error" });
    });
}
exports.default = handleErrors;
