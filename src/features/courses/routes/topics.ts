import { Router } from "express";
import { getTopic, getTopics } from "../controllers/topics";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router();
router.get("/", getTopics);
router.get("/:id", [validateUUIDPathParam("id")], getTopic);
export default router;
