import { Router } from "express";
import topic from "./topics";
import courses from "./courses";
const router = Router();
router.use("/topics", topic);
router.use("/", courses);
export default router;
