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
import imageUploader from "@/middlewares/image_uploader";
import fileUploader from "@/middlewares/file_uploader";
import uploader from "@/middlewares/upload";
import { validateUUIDPathParam } from "@/middlewares/validators";
import modulesRouter from "./modules";
import testRouter from "./tests";

const router = Router();
router.get("/", getCourses);
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

router.use("/:courseId/tests", [validateUUIDPathParam("courseId"), authenticate], testRouter);

export default router;
