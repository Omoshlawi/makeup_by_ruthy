"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tests_1 = require("../controllers/tests");
const validators_1 = require("../../../middlewares/validators");
const require_roles_1 = require("../../../middlewares/require_roles");
const testQuestions_1 = __importDefault(require("./testQuestions"));
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", tests_1.getTests);
router.post("/", [require_roles_1.requireInstructor], tests_1.addTest);
router.get("/:testId", [(0, validators_1.validateUUIDPathParam)("testId")], tests_1.getTest);
router.put("/:testId", [(0, validators_1.validateUUIDPathParam)("testId"), require_roles_1.requireInstructor], tests_1.updateTest);
router.delete("/:testId", [(0, validators_1.validateUUIDPathParam)("testId"), require_roles_1.requireInstructor], tests_1.deleteTest);
router.use("/:testId/questions", [(0, validators_1.validateUUIDPathParam)("testId")], testQuestions_1.default);
exports.default = router;
