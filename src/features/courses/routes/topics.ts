import { Router } from "express";
import {
  addTopic,
  deleteTopic,
  getTopic,
  getTopics,
  updateTopic,
} from "../controllers/topics";
import { validateUUIDPathParam } from "@/middlewares/validators";
import imageUploader from "@/middlewares/image_uploader";

const router = Router();
router.get("/", getTopics);
router.post(
  "/",
  [
    imageUploader.memoryImage().single("thumbnail"),
    imageUploader.postImageUpload("courses/topics").single("thumbnail"),
  ],
  addTopic
);
router.get("/:id", [validateUUIDPathParam("id")], getTopic);
router.put(
  "/:id",
  [
    validateUUIDPathParam("id"),
    imageUploader.memoryImage().single("thumbnail"),
    imageUploader.postImageUpload("courses/topics").single("thumbnail"),
  ],
  updateTopic
);
router.delete("/:id", [validateUUIDPathParam("id")], deleteTopic);
export default router;
