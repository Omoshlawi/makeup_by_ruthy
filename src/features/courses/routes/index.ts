import { Router } from "express";
import topic from "./topics";
const router = Router();
router.use("/topics", topic);
export default router;
