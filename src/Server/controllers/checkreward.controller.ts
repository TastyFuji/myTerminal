import { Request, Response } from "express";
import prisma from "../prisma";

export const checkReward = async (req: Request, res: Response): Promise<void> => {
  const { id, game } = req.body;

  try {
    const reward = await prisma.reward.findUnique({
      where: {
        userId_game: {
          userId: id,
          game: game,
        },
      },
    });

    const passed = !!reward;

    res.json({
      passed,
      message: passed
        ? `Already passed game: ${game}`
        : `Ready to play game: ${game}`,
    });

  } catch (error) {
    console.error("checkReward error:", error);
    res.status(500).json({ error: "Server error", detail: error });
  }
};
