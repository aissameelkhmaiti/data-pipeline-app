import * as MovieRepo from "../repositories/movie.repository";
import { Movie, CreateMovieInput, UpdateMovieInput } from "../models/movie.model";
import fs from "fs";
import csv from "csv-parser";

// Utilitaire pour transformer "148 min" ou "148" en nombre entier 148
const parseDuration = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // Supprime tout ce qui n'est pas un chiffre et convertit
    const cleaned = val.replace(/\D/g, "");
    return parseInt(cleaned, 10) || 0;
  }
  return 0;
};

// --- MÉTHODES EXISTANTES ---
export const createMovie = async (input: CreateMovieInput): Promise<Movie> => {
  return await MovieRepo.createMovie({
    ...input,
    duration: parseDuration(input.duration)
  });
};

export const getAllMovies = async (): Promise<Movie[]> => {
  return await MovieRepo.getAllMovies();
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  return await MovieRepo.getMovieById(id);
};

export const updateMovie = async (id: number, input: UpdateMovieInput): Promise<Movie | null> => {
  const formattedInput = { ...input };
  if (input.duration !== undefined) {
    formattedInput.duration = parseDuration(input.duration);
  }
  return await MovieRepo.updateMovie(id, formattedInput);
};

// --- MÉTHODE PIPELINE : IMPORTATION ---

export const importMoviesFromFile = async (filePath: string, mimetype: string): Promise<number> => {
  const moviesToInsert: CreateMovieInput[] = [];

  // Cas 1 : Fichier JSON
  if (mimetype === "application/json" || mimetype === "application/octet-stream") {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);
    
    const formattedData = jsonData.map((m: any) => ({
      title: m.title,
      release_date: m.release_date || m.releaseDate,
      duration: parseDuration(m.duration), // NETTOYAGE ICI
      genre: m.genre
    }));
    
    return await MovieRepo.bulkInsertMovies(formattedData);
  }

  // Cas 2 : Fichier CSV
  if (mimetype === "text/csv" || mimetype === "application/vnd.ms-excel") {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          moviesToInsert.push({
            title: row.title || row.Title,
            release_date: row.release_date || row.ReleaseDate,
            duration: parseDuration(row.duration || row.Duration), // NETTOYAGE ICI
            genre: row.genre || row.Genre
          });
        })
        .on("end", async () => {
          try {
            const count = await MovieRepo.bulkInsertMovies(moviesToInsert);
            resolve(count);
          } catch (err) {
            reject(err);
          }
        })
        .on("error", (err) => reject(err));
    });
  }

  throw new Error("Format de fichier non supporté");
};