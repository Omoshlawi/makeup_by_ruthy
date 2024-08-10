import { Router } from "express";
import { postReview, updateReview } from "../controllers/reviews";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router({ mergeParams: true });

router.post("/", postReview);
router.put("/:reviewId", validateUUIDPathParam("reviewId"), updateReview);

export default router;
