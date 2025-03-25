import { Request, Response } from "express";
import prisma from "../prisma";

export const addReward = async (req: Request, res: Response): Promise<void> => {
  const { id, game } = req.body;

  try {
    // ป้องกันการสร้างซ้ำ
    const existing = await prisma.reward.findUnique({
      where: {
        userId_game: {
          userId: id,
          game: game
        }
      }
    });

    if (existing) {
      res.status(409).json({ message: "Reward already exists for this game." });
      return;
    }

    const reward = await prisma.reward.create({
      data: {
        userId: id,
        game: game,
        level: 1
      }
    });

    res.json({
      message: "Added reward successfully",
      reward
    });

  } catch (error) {
    console.error("Add reward error:", error);
    res.status(500).json({ error: 'Add reward failed', detail: error });
  }
};
