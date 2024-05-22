import { Router } from "express";
import { getInstructors } from "../controllers";

const router = Router();
router.get("/", getInstructors)
export default router;
