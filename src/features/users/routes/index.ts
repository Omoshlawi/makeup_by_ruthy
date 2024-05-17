import authenticate from "@/middlewares/authentication";
import { Router } from "express";
import { getUsers, setUpAccount, updateProfile, viewProfile } from "../controllers";
import imageUploader from "@/middlewares/image_uploader";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.get("/profile", authenticate, viewProfile);
router.put(
  "/account-set-up",
  [
    authenticate,
    imageUploader.memoryImage().single("avatarUrl"),
    imageUploader.postImageUpload("user/avatar").single("avatarUrl"),
  ],
  setUpAccount
);
router.post("/", getUsers);

export default router;
