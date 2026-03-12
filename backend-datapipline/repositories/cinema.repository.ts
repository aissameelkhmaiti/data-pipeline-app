import pool from "../config/db";

export const CinemaRepository = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM cinemas ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id: number) => {
    const result = await pool.query("SELECT * FROM cinemas WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (cinema: { name: string; city: string; country: string }) => {
    const result = await pool.query(
      "INSERT INTO cinemas (name, city, country) VALUES ($1, $2, $3) RETURNING *",
      [cinema.name, cinema.city, cinema.country]
    );
    return result.rows[0];
  },

  update: async (id: number, cinema: { name?: string; city?: string; country?: string }) => {
    const current = await CinemaRepository.getById(id);
    if (!current) return null;

    const updated = {
      name: cinema.name || current.name,
      city: cinema.city || current.city,
      country: cinema.country || current.country,
    };

    const result = await pool.query(
      "UPDATE cinemas SET name=$1, city=$2, country=$3 WHERE id=$4 RETURNING *",
      [updated.name, updated.city, updated.country, id]
    );

    return result.rows[0];
  },

  delete: async (id: number) => {
    const result = await pool.query("DELETE FROM cinemas WHERE id=$1 RETURNING *", [id]);
    return result.rows[0];
  },
};