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

const router = Router({ mergeParams: true });

router.get("/", getCourseTests);
router.post("/", [requireInstructor], addCourseTest);
router.get("/:testId", [validateUUIDPathParam("testId")], getCourseTest);
router.put("/:testId", [validateUUIDPathParam("testId")], updateCourseTest);
router.delete(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  deleteCourseTest
);

export default router;
