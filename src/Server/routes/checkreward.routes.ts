import express from "express";
import { checkReward } from "../controllers/checkreward.controller";

const router = express.Router();

router.post("/checkreward", checkReward);

export default router;
