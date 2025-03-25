import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma";

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, displayName, role = "user" } = req.body;

    if (!username || !password || !displayName) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      res.status(409).json({ error: "Username already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        displayName,
        role,
      },
    });

    res.status(201).json({
      message: "User created successfully.",
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
};
