"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reviews_1 = require("../../../features/students/controllers/reviews");
const authentication_1 = __importDefault(require("../../../middlewares/authentication"));
const file_uploader_1 = __importDefault(require("../../../middlewares/file_uploader"));
const require_roles_1 = require("../../../middlewares/require_roles");
const validators_1 = require("../../../middlewares/validators");
const express_1 = require("express");
const courses_1 = require("../controllers/courses");
const modules_1 = __importDefault(require("./modules"));
const tests_1 = __importDefault(require("./tests"));
const router = (0, express_1.Router)();
router.get("/", courses_1.getCourses);
router.get("/authored", [authentication_1.default, require_roles_1.requireInstructor], courses_1.getMyCourses);
router.post("/", [
    authentication_1.default,
    require_roles_1.requireInstructor,
    file_uploader_1.default.diskStorage("tmp").fields([
        { name: "previewVideo", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    file_uploader_1.default.postUpload("courses").fields([
        { name: "previewVideo", mode: "single" },
        { name: "thumbnail", mode: "single" },
    ]),
], courses_1.addCourse);
router.get("/:id", courses_1.getCourse);
router.put("/:id", [
    authentication_1.default,
    require_roles_1.requireInstructor,
    file_uploader_1.default.diskStorage("tmp").fields([
        { name: "previewVideo", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 },
    ]),
    file_uploader_1.default.postUpload("courses").fields([
        { name: "previewVideo", mode: "single" },
        { name: "thumbnail", mode: "single" },
    ]),
], courses_1.updateCourse);
router.delete("/:id", courses_1.deleteCourse);
router.use("/:courseId/modules", (0, validators_1.validateUUIDPathParam)("courseId"), modules_1.default);
router.use("/:courseId/tests", [(0, validators_1.validateUUIDPathParam)("courseId"), authentication_1.default], tests_1.default);
router.get("/:courseId/reviews", [(0, validators_1.validateUUIDPathParam)("courseId"), authentication_1.default], reviews_1.getCourseReviews);
router.get("/:courseId/approval/:action", [(0, validators_1.validateUUIDPathParam)("courseId"), authentication_1.default, require_roles_1.requireAdmin], courses_1.toggleCourseApproval);
exports.default = router;
