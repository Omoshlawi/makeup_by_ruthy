import { Router } from "express";
import { addCourseModule } from "../controllers/modules";
import authenticate from "@/middlewares/authentication";
import { requireInstructor } from "@/middlewares/require_roles";

const router = Router({ mergeParams: true });
router.post("/", [authenticate, requireInstructor], addCourseModule);
export default router;
