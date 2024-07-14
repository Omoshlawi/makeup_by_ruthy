import { Router } from "express";

import { requireInstructor } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";
import {
  addTest,
  deleteTest,
  getTest,
  getTests,
  updateTest,
} from "../controllers/tests";
import moduleTestQuestionRouter from "./testQuestions";

const router = Router({ mergeParams: true });

router.get("/", getTests);
router.post("/", [requireInstructor], addTest);
router.get("/:testId", [validateUUIDPathParam("testId")], getTest);
router.put(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  updateTest
);
router.put(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  deleteTest
);

router.use(
  "/:testId/questions",
  [validateUUIDPathParam("testId")],
  moduleTestQuestionRouter
);

export default router;
