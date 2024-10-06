import authenticate from "@/middlewares/authentication";
import { Router } from "express";
import {
  getUsers,
  perfomUserAction,
  setUpAccount,
  updateProfile,
  viewProfile,
} from "../controllers";
import imageUploader from "@/middlewares/image_uploader";
import { requireAuthenticated } from "@/middlewares";
import { requireAdmin } from "@/middlewares/require_roles";

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
router.get("/", [requireAuthenticated, requireAdmin], getUsers);
router.get(
  "/:userId/actions/:action",
  [requireAuthenticated, requireAdmin],
  perfomUserAction
);

export default router;
