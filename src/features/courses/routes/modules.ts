import { Router } from "express";
import {
  addCourseModule,
  deleteCourseModule,
  updateCourseModule,
} from "../controllers/modules";
import contentRouter from "./content";
import authenticate from "@/middlewares/authentication";
import { requireInstructor } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";
import moduleTest from "./moduleTests";

const router = Router({ mergeParams: true });
router.post("/", [authenticate, requireInstructor], addCourseModule);
router.put(
  "/:id",
  [validateUUIDPathParam("id"), authenticate, requireInstructor],
  updateCourseModule
);
router.delete(
  "/:id",
  [validateUUIDPathParam("id"), authenticate, requireInstructor],
  deleteCourseModule
);
router.use(
  "/:moduleId/content",
  [validateUUIDPathParam("moduleId"), authenticate, requireInstructor],
  contentRouter
);

router.use(
  "/:moduleId/test",
  [validateUUIDPathParam("moduleId"), authenticate],
  moduleTest
);
export default router;
