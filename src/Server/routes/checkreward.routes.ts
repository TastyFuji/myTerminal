import express from "express";
import { checkReward } from "../controllers/checkreward.controller";

const router = express.Router();

router.post("/addReward", checkReward);

export default router;
