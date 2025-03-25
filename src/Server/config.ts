import dotenv from "dotenv";
import type { Secret } from "jsonwebtoken";

dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET not set in .env");
}

export const JWT_SECRET: Secret = secret;
