import { Router } from "express";
import {
  addCourseModule,
  deleteCourseModule,
  updateCourseModule,
} from "../controllers/modules";
import authenticate from "@/middlewares/authentication";
import { requireInstructor } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";

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
export default router;
