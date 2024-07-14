import { Router } from "express";
import {
  addCourseTest,
  deleteCourseTest,
  getCourseTest,
  getCourseTests,
  updateCourseTest,
} from "../controllers/courseTests";
import { validateUUIDPathParam } from "@/middlewares/validators";
import { requireInstructor } from "@/middlewares/require_roles";
import testQuestionsRouter from "./testQuestions";

const router = Router({ mergeParams: true });

router.get("/", getCourseTests);
router.post("/", [requireInstructor], addCourseTest);
router.get("/:testId", [validateUUIDPathParam("testId")], getCourseTest);
router.put(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  updateCourseTest
);
router.delete(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  deleteCourseTest
);
router.use(
  "/:testId/questions",
  [validateUUIDPathParam("testId")],
  testQuestionsRouter
);

export default router;
