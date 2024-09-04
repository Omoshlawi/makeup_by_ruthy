"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorModel = void 0;
const db_1 = __importDefault(require("../../../services/db"));
exports.InstructorModel = db_1.default.instructor;
