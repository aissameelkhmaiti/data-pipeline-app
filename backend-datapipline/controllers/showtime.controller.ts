import { Request, Response } from "express";
import { ShowtimeService } from "../services/showtime.service";

export const ShowtimeController = {
  create: async (req: Request, res: Response) => {
    const showtime = await ShowtimeService.create(req.body);
    res.status(201).json({ showtime });
  },

  getAll: async (req: Request, res: Response) => {
    const showtimes = await ShowtimeService.findAll();
    res.json({ showtimes });
  },

  getById: async (req: Request, res: Response) => {
    const showtime = await ShowtimeService.findById(Number(req.params.id));
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.json({ showtime });
  },

  update: async (req: Request, res: Response) => {
    const showtime = await ShowtimeService.update(Number(req.params.id), req.body);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });
    res.json({ showtime });
  },

  delete: async (req: Request, res: Response) => {
    await ShowtimeService.delete(Number(req.params.id));
    res.json({ message: "Showtime deleted" });
  },
};