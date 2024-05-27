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
    fileUploader
      .postUpload("courses")
      .fields([{ name: "previewVideo" }, { name: "thumbnail" }]),
  ],
  addCourse
);
router.get("/:id", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
export default router;
