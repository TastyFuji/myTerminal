import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn : "2h" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
