import { Router } from "express";
import {
  addModuleContent,
  deleteModuleContent,
  updateModuleContent,
} from "../controllers/content";
import { validateUUIDPathParam } from "@/middlewares/validators";
import fileUploader from "@/middlewares/file_uploader";

const router = Router({ mergeParams: true });
router.post(
  "/",
  [
    fileUploader
      .diskStorage("draft")
      .fields([{ name: "resource", maxCount: 1 }]),
    fileUploader
      .postUpload("courses")
      .fields([{ name: "resource", maxCount: 1, mode: "single" }]),
  ],
  addModuleContent
);
router.put(
  "/:id",
  [
    validateUUIDPathParam("id"),
    fileUploader
      .diskStorage("draft")
      .fields([{ name: "resource", maxCount: 1 }]),
    fileUploader
      .postUpload("courses")
      .fields([{ name: "resource", maxCount: 1, mode: "single" }]),
  ],
  updateModuleContent
);
router.delete("/:id", validateUUIDPathParam("id"), deleteModuleContent);
export default router;
