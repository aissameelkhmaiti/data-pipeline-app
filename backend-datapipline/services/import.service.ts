import fs from "fs";
import csv from "csv-parser";
import path from "path";

import * as movieRepository from "../repositories/movie.repository";
import * as pipelineRepository from "../repositories/pipeline.repository";

// ----------- UTILITAIRES -----------

const parseDuration = (value: any): number => {
  if (!value) return 0;

  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const cleaned = value.replace(/\D/g, "");
    return parseInt(cleaned) || 0;
  }

  return 0;
};

const parseReleaseDate = (value: any): string => {
  if (!value) return "1900-01-01";

  const year = Number(value);

  if (isNaN(year)) return "1900-01-01";

  return `${year}-01-01`;
};

// ----------- PIPELINE ETL -----------

export const processImportFile = async (
  originalname: string,
  mimetype: string
) => {

  const results: any[] = [];
  const fileName = originalname;

  // -------- TRANSFORM --------
  const transformMovies = (movies: any[]) => {
    return movies.map((movie) => ({
      title: movie.title || movie.Title,
      release_date: parseReleaseDate(
        movie.release_date || movie.year || movie.Year
      ),
      duration: parseDuration(movie.duration || movie.Duration),
      genre: movie.genre || movie.Genre || "",
    }));
  };

  try {

    // ================= JSON =================

    if (mimetype === "application/json") {

      const data = fs.readFileSync(originalname, "utf-8");

      const movies = JSON.parse(data);

      console.log(" JSON extracted:", movies);

      // TRANSFORM
      const cleanedMovies = transformMovies(movies);

      console.log(" JSON transformed:", cleanedMovies);

      // LOAD
      await movieRepository.bulkInsertMovies(cleanedMovies);

      // LOG PIPELINE
      await pipelineRepository.createPipelineLog(
        fileName,
        cleanedMovies.length,
       mimetype,
        "success"
      );

      return cleanedMovies.length;
    }

    // ================= CSV =================

    if (mimetype === "text/csv" || mimetype === "application/vnd.ms-excel") {

      return new Promise((resolve, reject) => {

        fs.createReadStream(originalname)
          .pipe(csv())

          .on("data", (data) => results.push(data))

          .on("end", async () => {

            try {

              console.log(" CSV extracted:", results);

              // TRANSFORM
              const cleanedMovies = transformMovies(results);

              console.log(" CSV transformed:", cleanedMovies);

              // LOAD
              await movieRepository.bulkInsertMovies(cleanedMovies);

              // LOG PIPELINE
              await pipelineRepository.createPipelineLog(
                fileName,
                cleanedMovies.length,
                mimetype,
                "success"
              );

              resolve(cleanedMovies.length);

            } catch (error) {

              await pipelineRepository.createPipelineLog(
                fileName,
                0,
                mimetype,
                "failed"
              );

              reject(error);
            }

          })

          .on("error", async (error) => {

            await pipelineRepository.createPipelineLog(
              fileName,
              0,
              mimetype,
              "failed"
            );

            reject(error);
          });

      });
    }

    throw new Error("Format de fichier non supporté");

  } catch (error) {

    await pipelineRepository.createPipelineLog(
      fileName,
      0,
      mimetype,
      "failed"
    );

    throw error;
  }
};