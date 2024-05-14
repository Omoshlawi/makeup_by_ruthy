import { Router } from "express";
import {
  addTopic,
  deleteTopic,
  getTopic,
  getTopics,
  updateTopic,
} from "../controllers/topics";
import { validateUUIDPathParam } from "@/middlewares/validators";

const router = Router();
router.get("/", getTopics);
router.post("/", addTopic);
router.get("/:id", [validateUUIDPathParam("id")], getTopic);
router.put("/:id", [validateUUIDPathParam("id")], updateTopic);
router.delete("/:id", [validateUUIDPathParam("id")], deleteTopic);
export default router;
