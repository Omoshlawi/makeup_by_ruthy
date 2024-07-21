import { Router } from "express";
import {
  addTestAttempts,
  deleteTestAttempts,
  getTestAttempts,
} from "../controllers/attempts";
import { requireStudent } from "@/middlewares/require_roles";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router({ mergeParams: true });

router.get("/", getTestAttempts);
router.post("/", addTestAttempts);
router.delete(
  "/:attemptId",
  [validateUUIDPathParam("attemptId")],
  deleteTestAttempts
);
export default router;
