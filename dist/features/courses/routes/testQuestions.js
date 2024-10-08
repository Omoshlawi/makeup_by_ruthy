"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testQuestions_1 = require("../controllers/testQuestions");
const require_roles_1 = require("../../../middlewares/require_roles");
const router = (0, express_1.Router)({ mergeParams: true });
router.get("/", testQuestions_1.getTestQuestions);
router.get("/:questionId", testQuestions_1.getTestQuestion);
router.post("/", [require_roles_1.requireInstructor], testQuestions_1.addTestQuestion);
router.put("/:questionId", [require_roles_1.requireInstructor], testQuestions_1.updateTestQuestions);
router.delete("/:questionId", [require_roles_1.requireInstructor], testQuestions_1.deleteTestQuestions);
exports.default = router;
