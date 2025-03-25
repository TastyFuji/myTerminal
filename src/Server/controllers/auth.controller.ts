import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";
import { generateToken } from "../Utils/jwt";

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
    }
    const token = generateToken({ userId: user.id, role: user.role });

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role,
        },
    });
};
