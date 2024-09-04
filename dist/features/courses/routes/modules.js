"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const modules_1 = require("../controllers/modules");
const content_1 = __importDefault(require("./content"));
const authentication_1 = __importDefault(require("../../../middlewares/authentication"));
const require_roles_1 = require("../../../middlewares/require_roles");
const validators_1 = require("../../../middlewares/validators");
const tests_1 = __importDefault(require("./tests"));
const router = (0, express_1.Router)({ mergeParams: true });
router.post("/", [authentication_1.default, require_roles_1.requireInstructor], modules_1.addCourseModule);
router.put("/:id", [(0, validators_1.validateUUIDPathParam)("id"), authentication_1.default, require_roles_1.requireInstructor], modules_1.updateCourseModule);
router.delete("/:id", [(0, validators_1.validateUUIDPathParam)("id"), authentication_1.default, require_roles_1.requireInstructor], modules_1.deleteCourseModule);
router.use("/:moduleId/content", [(0, validators_1.validateUUIDPathParam)("moduleId"), authentication_1.default, require_roles_1.requireInstructor], content_1.default);
router.use("/:moduleId/tests", [(0, validators_1.validateUUIDPathParam)("moduleId"), authentication_1.default], tests_1.default);
exports.default = router;
