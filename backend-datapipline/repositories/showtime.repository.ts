import pool from "../config/db";
import { Showtime } from "../models/showtime.model";

export const ShowtimeRepository = {
  async create(showtime: Omit<Showtime, "id" | "created_at">) {
    const result = await pool.query(
      `INSERT INTO showtimes (movie_id, cinema_id, start_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [showtime.movie_id, showtime.cinema_id, showtime.start_time, showtime.end_time]
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query("SELECT * FROM showtimes");
    return result.rows;
  },

  async findById(id: number) {
    const result = await pool.query("SELECT * FROM showtimes WHERE id=$1", [id]);
    return result.rows[0];
  },

  async update(id: number, showtime: Partial<Showtime>) {
    const result = await pool.query(
      `UPDATE showtimes 
       SET movie_id=$1, cinema_id=$2, start_time=$3, end_time=$4 
       WHERE id=$5 RETURNING *`,
      [showtime.movie_id, showtime.cinema_id, showtime.start_time, showtime.end_time, id]
    );
    return result.rows[0];
  },

  async delete(id: number) {
    await pool.query("DELETE FROM showtimes WHERE id=$1", [id]);
  },
};