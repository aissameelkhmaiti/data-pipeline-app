import pool from "../config/db";
import { Movie, CreateMovieInput, UpdateMovieInput } from "../models/movie.model";

// --- CRUD EXISTANT ---

export const createMovie = async (input: CreateMovieInput): Promise<Movie> => {
  const res = await pool.query(
    `INSERT INTO movies (title, release_date, duration, genre)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [input.title, input.release_date, input.duration, input.genre]
  );
  return res.rows[0];
};

export const getMoviesPaginated = async (limit: number, offset: number) => {
  // 1. Récupérer les données segmentées
  const moviesQuery = await pool.query(
    `SELECT * FROM movies ORDER BY id DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  // 2. Récupérer le nombre total pour calculer les pages
  const countQuery = await pool.query(`SELECT COUNT(*) FROM movies`);
  const totalCount = parseInt(countQuery.rows[0].count);

  return {
    movies: moviesQuery.rows,
    totalCount
  };
};

export const getMovieById = async (id: number): Promise<Movie | null> => {
  const res = await pool.query(`SELECT * FROM movies WHERE id = $1`, [id]);
  return res.rows[0] || null;
};

export const updateMovie = async (id: number, input: UpdateMovieInput): Promise<Movie | null> => {
  const fields = Object.keys(input);
  const values = Object.values(input);
  if (fields.length === 0) return getMovieById(id);

  const setQuery = fields.map((field, idx) => `${field}=$${idx + 1}`).join(", ");
  const res = await pool.query(
    `UPDATE movies SET ${setQuery} WHERE id=$${fields.length + 1} RETURNING *`,
    [...values, id]
  );
  return res.rows[0] || null;
};

// --- NOUVELLE MÉTHODE : BULK INSERT POUR LE PIPELINE ---

/**
 * Insère plusieurs films en une seule transaction.
 * Utile pour l'importation CSV/JSON et la synchronisation API.
 */
export const bulkInsertMovies = async (movies: CreateMovieInput[]): Promise<number> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    let insertedCount = 0;
    for (const movie of movies) {
      // Utilisation de ON CONFLICT pour éviter les erreurs si le titre existe déjà
      const query = `
        INSERT INTO movies (title, release_date, duration, genre)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (title) DO NOTHING
      `;
      const res = await client.query(query, [
        movie.title, 
        movie.release_date, 
        movie.duration, 
        movie.genre
      ]);
      
      if (res.rowCount && res.rowCount > 0) insertedCount++;
    }

    await client.query("COMMIT");
    return insertedCount;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};