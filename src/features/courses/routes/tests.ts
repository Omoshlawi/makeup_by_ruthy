import { Router } from "express";
import {
  addTest,
  deleteTest,
  getTest,
  getTests,
  updateTest,
} from "../controllers/tests";
import { validateUUIDPathParam } from "@/middlewares/validators";
import { requireInstructor } from "@/middlewares/require_roles";
import testQuestionsRouter from "./testQuestions";
import testAttempts from "../../students/routes/testAttempts";

const router = Router({ mergeParams: true });

router.get("/", getTests);
router.post("/", [requireInstructor], addTest);
router.get("/:testId", [validateUUIDPathParam("testId")], getTest);
router.put(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  updateTest
);
router.delete(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  deleteTest
);
router.use(
  "/:testId/questions",
  [validateUUIDPathParam("testId")],
  testQuestionsRouter
);
export default router;
