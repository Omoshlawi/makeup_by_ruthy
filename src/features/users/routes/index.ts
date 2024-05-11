import authenticate from "@/middlewares/authentication";
import { Router } from "express";
import { getUsers, updateProfile, viewProfile } from "../controllers";

const router = Router();

router.put("/profile", authenticate, updateProfile);
router.get("/profile", authenticate, viewProfile);
router.post("/", getUsers);

export default router;
