import { Router } from "express";
import {
  addTestQuestion,
  deleteTestQuestions,
  getTestQuestion,
  getTestQuestions,
  updateTestQuestions,
} from "../controllers/testQuestions";
import { requireInstructor } from "@/middlewares/require_roles";

const router = Router({ mergeParams: true });

router.get("/", getTestQuestions);
router.get("/:questionId", getTestQuestion);
router.post("/", [requireInstructor], addTestQuestion);
router.put("/:questionId", [requireInstructor], updateTestQuestions);
router.delete("/:questionId", [requireInstructor], deleteTestQuestions);

export default router;
