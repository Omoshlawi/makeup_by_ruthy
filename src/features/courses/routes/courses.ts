import { getCourseReviews } from "@/features/students/controllers/reviews";
import authenticate from "@/middlewares/authentication";
import fileUploader from "@/middlewares/file_uploader";
import { requireAdmin, requireInstructor } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";
import { Router } from "express";
import {
  addCourse,
  aproveCourse,
  deleteCourse,
  getCourse,
  getCourses,
  getMyCourses,
  rejectCourse,
  updateCourse,
} from "../controllers/courses";
import modulesRouter from "./modules";
import testRouter from "./tests";

const router = Router();
router.get("/", getCourses);
router.get("/authored", [authenticate, requireInstructor], getMyCourses);

router.post(
  "/",
  [
    authenticate,
    requireInstructor,
    fileUploader.diskStorage("tmp").fields([
      { name: "previewVideo", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    fileUploader.postUpload("courses").fields([
      { name: "previewVideo", mode: "single" },
      { name: "thumbnail", mode: "single" },
    ]),
  ],
  addCourse
);
router.get("/:id", getCourse);
router.put(
  "/:id",
  [
    authenticate,
    requireInstructor,
    fileUploader.diskStorage("tmp").fields([
      { name: "previewVideo", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    fileUploader.postUpload("courses").fields([
      { name: "previewVideo", mode: "single" },
      { name: "thumbnail", mode: "single" },
    ]),
  ],
  updateCourse
);
router.delete("/:id", deleteCourse);
router.use(
  "/:courseId/modules",
  validateUUIDPathParam("courseId"),
  modulesRouter
);

router.use(
  "/:courseId/tests",
  [validateUUIDPathParam("courseId"), authenticate],
  testRouter
);
router.get(
  "/:courseId/reviews",
  [validateUUIDPathParam("courseId"), authenticate],
  getCourseReviews
);

router.get(
  "/:courseId/approve",
  [validateUUIDPathParam("courseId"), authenticate, requireAdmin],
  aproveCourse
);

router.post(
  "/:courseId/reject",
  [validateUUIDPathParam("courseId"), authenticate, requireAdmin],
  rejectCourse
);

export default router;
