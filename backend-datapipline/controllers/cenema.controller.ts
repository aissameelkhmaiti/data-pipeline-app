import { Request, Response } from "express";
import { CinemaService } from "../services/cenema.service";

export const CinemaController = {
  getAll: async (req: Request, res: Response) => {
    const cinemas = await CinemaService.getAllCinemas();
    res.status(200).json({ cinemas });
  },

  getById: async (req: Request, res: Response) => {
    const cinema = await CinemaService.getCinemaById(Number(req.params.id));
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.status(200).json({ cinema });
  },

  create: async (req: Request, res: Response) => {
    const { name, city, country ,la_salle } = req.body;
    const cinema = await CinemaService.createCinema({ name, city, country ,la_salle });
    res.status(201).json({ cinema });
  },

  update: async (req: Request, res: Response) => {
    const cinema = await CinemaService.updateCinema(Number(req.params.id), req.body);
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.status(200).json({ cinema });
  },

  delete: async (req: Request, res: Response) => {
    const cinema = await CinemaService.deleteCinema(Number(req.params.id));
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.status(200).json({ message: "Cinema deleted" });
  },
};