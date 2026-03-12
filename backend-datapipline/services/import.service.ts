import fs from "fs";
import csv from "csv-parser";
import * as movieRepository from "../repositories/movie.repository";

export const processImportFile = async (filePath: string, fileType: string) => {
  const results: any[] = [];

  // fonction de transformation
  const transformMovies = (movies: any[]) => {
    return movies.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date,
      duration: parseInt(movie.duration), // "148 min" -> 148
      genre: movie.genre,
    }));
  };

  // JSON IMPORT
  if (fileType === "application/json") {
    const data = fs.readFileSync(filePath, "utf-8");

    const movies = JSON.parse(data);

    console.log("movies extracted:", movies);

    // TRANSFORM
    const cleanedMovies = transformMovies(movies);

    console.log("movies transformed:", cleanedMovies);

    // LOAD
    await movieRepository.bulkInsertMovies(cleanedMovies);

    return cleanedMovies.length;
  }

  // CSV IMPORT
  if (fileType === "text/csv") {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            console.log("csv extracted:", results);

            // TRANSFORM
            const cleanedMovies = transformMovies(results);

            console.log("csv transformed:", cleanedMovies);

            // LOAD
            await movieRepository.bulkInsertMovies(cleanedMovies);

            resolve(cleanedMovies.length);
          } catch (err) {
            reject(err);
          }
        });
    });
  }
};