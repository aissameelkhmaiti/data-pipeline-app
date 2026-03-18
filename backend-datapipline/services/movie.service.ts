// movie.service.ts
import * as MovieRepo from "../repositories/movie.repository";
import { Movie, CreateMovieInput, UpdateMovieInput } from "../models/movie.model";
import fs from "fs";
import csv from "csv-parser";

// ------------------ UTILITAIRES ------------------

// Convertit "148 min" ou "148" en nombre entier 148
const parseDuration = (val: any): number => {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/\D/g, "");
    return parseInt(cleaned, 10) || 0;
  }
  return 0;
};

// Convertit année ou valeur en string YYYY-MM-DD
const parseReleaseDate = (val: any): string => {
  if (!val) return "1900-01-01"; // valeur par défaut si vide
  const year = Number(val);
  if (isNaN(year)) return "1900-01-01"; // fallback
  return `${year}-01-01`;
};

// ------------------ MÉTHODES CRUD ------------------

export const createMovie = async (input: CreateMovieInput): Promise<Movie> => {
  return await MovieRepo.createMovie({
    ...input,
    duration: parseDuration(input.duration),
    release_date: parseReleaseDate(input.release_date),
  });
};

export const getMovies = async (limit: number, page: number) => {
  const offset = (page - 1) * limit;
  const { movies, totalCount } = await MovieRepo.getMoviesPaginated(limit, offset);
  
  return {
    movies,
    totalPages: Math.ceil(totalCount / limit),
    totalCount
  };
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  return await MovieRepo.getMovieById(id);
};

export const updateMovie = async (id: number, input: UpdateMovieInput): Promise<Movie | null> => {
  const formattedInput = {
    ...input,
    duration: input.duration !== undefined ? parseDuration(input.duration) : undefined,
    release_date: input.release_date ? parseReleaseDate(input.release_date) : undefined,
  };
  return await MovieRepo.updateMovie(id, formattedInput);
};

// ------------------ MÉTHODE PIPELINE : IMPORTATION ------------------

export const importMoviesFromFile = async (
  filePath: string,
  mimetype: string
): Promise<number> => {
  const moviesToInsert: CreateMovieInput[] = [];

  // --- JSON ---
  if (mimetype === "application/json" || mimetype === "application/octet-stream") {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    jsonData.forEach((m: any) => {
      moviesToInsert.push({
        title: m.title,
        release_date: parseReleaseDate(m.release_date || m.ReleaseDate || m.year),
        duration: parseDuration(m.duration || m.rating),
        genre: m.genre || "",
      });
    });

    const count = await MovieRepo.bulkInsertMovies(moviesToInsert);
    console.log(`✅ ${count} films JSON importés`);
    return count;
  }

  // --- CSV ---
  if (mimetype === "text/csv" || mimetype === "application/vnd.ms-excel") {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          moviesToInsert.push({
            title: row.title || row.Title,
             release_date: parseReleaseDate(row.year || row.Year), // jamais null
            duration: parseDuration(row.duration || row.Duration || 0),
            genre: row.genre || row.Genre || "",
          });
        })
        .on("end", async () => {
          try {
            const count = await MovieRepo.bulkInsertMovies(moviesToInsert);
            console.log(`✅ ${count} films CSV importés`);
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