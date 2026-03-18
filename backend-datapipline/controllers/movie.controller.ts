import { Request, Response } from "express";
import * as MovieService from "../services/movie.service";
import { CreateMovieInput, UpdateMovieInput } from "../models/movie.model";
import fs from "fs";

// --- CRUD STANDARDS ---

export const createMovieController = async (req: Request, res: Response) => {
  try {
    const input: CreateMovieInput = req.body;
    if (!input.title || !input.release_date || !input.duration || !input.genre) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const movie = await MovieService.createMovie(input);
    res.status(201).json({ movie });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMoviesController = async (req: Request, res: Response) => {
  try {
    // Récupération et conversion des paramètres (ex: /api/movies?page=1&limit=5)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    const result = await MovieService.getMovies(limit, page);

    res.status(200).json({
      movies: result.movies,
      totalPages: result.totalPages,
      currentPage: page,
      totalCount: result.totalCount
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMovieByIdController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const movie = await MovieService.getMovieById(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ movie });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMovieController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const input: UpdateMovieInput = req.body;
    const updated = await MovieService.updateMovie(id, input);
    if (!updated) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ movie: updated });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// --- MÉTHODE PIPELINE : IMPORTATION ---

/**
 * Controller pour gérer l'upload de fichiers CSV/JSON
 * Utilise Multer pour réceptionner le fichier avant traitement
 */
export const importMoviesController = async (req: Request, res: Response) => {
  try {
    // Vérification de la présence du fichier (injecté par Multer)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Appel du service pour parser et insérer en base
    const count = await MovieService.importMoviesFromFile(req.file.path, req.file.mimetype);

    // Suppression du fichier temporaire du serveur après traitement
    fs.unlinkSync(req.file.path);

    res.status(201).json({ 
      message: "Data imported successfully", 
      count: count 
    });
  } catch (error: any) {
    // Nettoyage sécurisé du fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Import failed", error: error.message });
  }
};