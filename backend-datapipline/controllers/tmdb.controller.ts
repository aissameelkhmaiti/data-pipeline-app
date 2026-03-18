import { Request, Response } from "express";
import { getPopularMovies } from "../services/tmdb.service";
import pool from "../config/db"; // Postgres
import { io } from "../server"; 

export const syncExternalMovies = async (req: Request, res: Response) => {
  try {
    io.emit("import_status", { message: "Importation en cours..." });

    const movies = await getPopularMovies();

    let count = 0; // Compteur pour les films ajoutés
    for (const movie of movies) {
      const result = await pool.query(
        `INSERT INTO movies (title, release_date, duration, genre, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (title) DO NOTHING
         RETURNING *`,
        [movie.title, movie.release_date, movie.duration, movie.genre]
      );
        count++; // Incrémente si un film a été ajouté
    }

    io.emit("import_status", { message: `Importation réussie : ${count} éléments ajoutés.` });

    // Log pipeline
    await pool.query(
      `INSERT INTO pipeline_logs (source_name, status, rows_processed, created_at)
       VALUES ($1, $2, $3, NOW())`,
      ["TMDB API", "success", count]
    );

    res.status(200).json({ message: `Synchronisation terminée : ${count} films ajoutés` });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la synchronisation TMDB", error: error.message });
  }
};

export const fetchPopularMovies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const movies = await getPopularMovies(page);

    res.status(200).json({
      message: `${movies.length} films récupérés`,
      data: movies.slice(0, 10), // par exemple on renvoie les 10 premiers
    });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur lors de la récupération des films", error: error.message });
  }
};