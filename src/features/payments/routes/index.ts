import { Router } from "express";
import mpesaRouter from "./mpesa";
const router = Router();

router.use("/mpesa", mpesaRouter);
export default router;
