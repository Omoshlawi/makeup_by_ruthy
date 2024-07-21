import { Router } from "express";
import {
  enroll,
  getStudents,
  completeEnrollmentPayement,
  getMyEnrollments,
  progress,
  getMyEnrollment,
} from "../controllers";
import { requireAuthenticated } from "@/middlewares";
import { requireStudent } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";
import attemtsRouter from "./testAttempts";

const router = Router();

router.get("/", getStudents);
router.post(
  "/enroll/:courseId",
  [validateUUIDPathParam("courseId"), requireAuthenticated, requireStudent],
  enroll
);
router.post(
  "/enrollments/:enrollmentId/complete-payment",
  [validateUUIDPathParam("enrollmentId"), requireAuthenticated, requireStudent],
  completeEnrollmentPayement
);

router.get(
  "/enrollments",
  [requireAuthenticated, requireStudent],
  getMyEnrollments
);

router.get(
  "/enrollments/:id",
  [validateUUIDPathParam("id"), requireAuthenticated, requireStudent],
  getMyEnrollment
);
router.use(
  "/enrollments/:enrollmentId/tests/:testId/attempts",
  [
    validateUUIDPathParam("enrollmentId"),
    validateUUIDPathParam("testId"),
    requireAuthenticated,
    requireStudent,
  ],
  attemtsRouter
);

router.get(
  "/enrollments/:enrollmentId/progress/:moduleId/:contentId",
  [
    validateUUIDPathParam("enrollmentId"),
    validateUUIDPathParam("moduleId"),
    validateUUIDPathParam("contentId"),
    requireAuthenticated,
    requireStudent,
  ],
  progress
);
export default router;
