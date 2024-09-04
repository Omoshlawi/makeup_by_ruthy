"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseReviewModel = exports.ModuleProgressModel = exports.EnrollmentModel = exports.StudentsModel = void 0;
const db_1 = __importDefault(require("../../../services/db"));
exports.StudentsModel = db_1.default.student;
exports.EnrollmentModel = db_1.default.enrollment;
exports.ModuleProgressModel = db_1.default.moduleProgress;
exports.CourseReviewModel = db_1.default.courseReview;
