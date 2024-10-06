import { Router } from "express";
import { getModelsAggregates } from "../controllers";

const router = Router();
router.get("/summary", getModelsAggregates);

export default router;
