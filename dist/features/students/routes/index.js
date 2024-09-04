"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../../../middlewares");
const require_roles_1 = require("../../../middlewares/require_roles");
const validators_1 = require("../../../middlewares/validators");
const testAttempts_1 = __importDefault(require("./testAttempts"));
const reviews_1 = __importDefault(require("./reviews"));
const router = (0, express_1.Router)();
router.get("/", controllers_1.getStudents);
router.post("/enroll/:courseId", [(0, validators_1.validateUUIDPathParam)("courseId"), middlewares_1.requireAuthenticated, require_roles_1.requireStudent], controllers_1.enroll);
router.post("/enrollments/:enrollmentId/complete-payment", [(0, validators_1.validateUUIDPathParam)("enrollmentId"), middlewares_1.requireAuthenticated, require_roles_1.requireStudent], controllers_1.completeEnrollmentPayement);
router.get("/enrollments/:enrollmentId/download-certificate", [(0, validators_1.validateUUIDPathParam)("enrollmentId"), middlewares_1.requireAuthenticated, require_roles_1.requireStudent], controllers_1.downLoadCertificate);
router.get("/enrollments", [middlewares_1.requireAuthenticated, require_roles_1.requireStudent], controllers_1.getMyEnrollments);
router.get("/enrollments/:id", [(0, validators_1.validateUUIDPathParam)("id"), middlewares_1.requireAuthenticated, require_roles_1.requireStudent], controllers_1.getMyEnrollment);
router.use("/enrollments/:enrollmentId/tests/:testId/attempts", [
    (0, validators_1.validateUUIDPathParam)("enrollmentId"),
    (0, validators_1.validateUUIDPathParam)("testId"),
    middlewares_1.requireAuthenticated,
    require_roles_1.requireStudent,
], testAttempts_1.default);
router.use("/enrollments/:enrollmentId/reviews", [(0, validators_1.validateUUIDPathParam)("enrollmentId"), middlewares_1.requireAuthenticated, require_roles_1.requireStudent], reviews_1.default);
router.get("/enrollments/:enrollmentId/progress/:moduleId/:contentId", [
    (0, validators_1.validateUUIDPathParam)("enrollmentId"),
    (0, validators_1.validateUUIDPathParam)("moduleId"),
    (0, validators_1.validateUUIDPathParam)("contentId"),
    middlewares_1.requireAuthenticated,
    require_roles_1.requireStudent,
], controllers_1.progress);
exports.default = router;
