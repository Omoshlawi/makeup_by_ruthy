import { Router } from "express";
import {
  enroll,
  getStudents,
  completeEnrollmentPayement,
} from "../controllers";
import { requireAuthenticated } from "@/middlewares";
import { requireStudent } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router();

router.get("/", getStudents);
router.post(
  "/enroll/:courseId",
  [validateUUIDPathParam("courseId"), requireAuthenticated, requireStudent],
  enroll
);
router.post(
  "/enrollment/:enrollmentId/complete-payment",
  [validateUUIDPathParam("enrollmentId"), requireAuthenticated, requireStudent],
  completeEnrollmentPayement
);

export default router;
