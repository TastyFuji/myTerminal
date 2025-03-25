import express from "express";
import { createUser } from "../controllers/user.controller";

const router = express.Router();

// ✅ ถูกต้อง
router.post("/reg", createUser);

export default router;
