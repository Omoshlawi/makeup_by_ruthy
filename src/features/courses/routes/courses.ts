import { Router } from "express";
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/courses";
import authenticate from "@/middlewares/authentication";
import { requireInstructor } from "@/middlewares/require_roles";

const router = Router();
router.get("/", getCourses);
router.post("/", [authenticate, requireInstructor], addCourse);
router.get("/:id", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
export default router;
