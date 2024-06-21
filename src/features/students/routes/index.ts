import { Router } from "express";
import { getStudents } from "../controllers";
import { requireAuthenticated } from "@/middlewares";
import { requireStudent } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router();

router.get("/", getStudents)
router.post("/enroll/:courseId", [validateUUIDPathParam("courseId"),requireAuthenticated, requireStudent], )


export default router;
