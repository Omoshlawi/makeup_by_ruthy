import { Router } from "express";
import {
  addCourseModuleTest,
  deleteCourseModuleTest,
  getCourseModuleTest,
  getCourseModuleTests,
  updateCourseModuleTest,
} from "../controllers/moduleTests";
import { requireInstructor } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router({ mergeParams: true });

router.get("/", getCourseModuleTests);
router.post("/", [requireInstructor], addCourseModuleTest);
router.get("/:testId", [validateUUIDPathParam("testId")], getCourseModuleTest);
router.put(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  updateCourseModuleTest
);
router.put(
  "/:testId",
  [validateUUIDPathParam("testId"), requireInstructor],
  deleteCourseModuleTest
);

export default router;
