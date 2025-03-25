import express from "express";
import { addReward } from "../controllers/hackreward.controller";

const router = express.Router();

router.post("/addReward", addReward);

export default router;
