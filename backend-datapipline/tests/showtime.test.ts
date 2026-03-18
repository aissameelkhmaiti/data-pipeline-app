import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app";
import pool from "../config/db";

let token: string;
let showtimeId: number;
let movieId: number;
let cinemaId: number;

describe("Showtime API CRUD", () => {

  // Créer un utilisateur et récupérer un token avant tous les tests
  beforeAll(async () => {
    const email = `testshowtime${Date.now()}@mail.com`;
    const password = "123456";

    const resRegister = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    token = resRegister.body.token;

    // Créer un film et un cinéma pour les showtimes
    const resMovie = await pool.query(
  `INSERT INTO movies (title, description, release_date, genre) VALUES ($1, $2, $3, $4) RETURNING *`,
  ["Movie Test 222233", "Description Movie", "2026-01-01", "Action"] // ou n'importe quel genre de test
);
    movieId = resMovie.rows[0].id;

    const resCinema = await pool.query(
      `INSERT INTO cinemas (name, city, country) VALUES ($1,$2,$3) RETURNING *`,
      ["Cinema Test 22233", "Casablanca", "Morocco"]
    );
    cinemaId = resCinema.rows[0].id;
  });

  it("should create a new showtime", async () => {
    const res = await request(app)
      .post("/api/showtimes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        movie_id: movieId,
        cinema_id: cinemaId,
        start_time: "2026-03-10T10:00:00Z",
        end_time: "2026-03-10T12:00:00Z"
      });

    expect(res.status).toBe(201);
    expect(res.body.showtime).toHaveProperty("id");
    showtimeId = res.body.showtime.id;
  });

  it("should fetch showtime by id", async () => {
    const res = await request(app).get(`/api/showtimes/${showtimeId}`);
    expect(res.status).toBe(200);
    expect(res.body.showtime).toHaveProperty("id", showtimeId);
    expect(res.body.showtime.movie_id).toBe(movieId);
    expect(res.body.showtime.cinema_id).toBe(cinemaId);
  });

  it("should update showtime", async () => {
    const res = await request(app)
      .put(`/api/showtimes/${showtimeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ start_time: "2026-03-10T11:00:00Z" });

    expect(res.status).toBe(200);
    expect(res.body.showtime.start_time).toContain("11:00");
  });

  it("should delete showtime", async () => {
    const res = await request(app)
      .delete(`/api/showtimes/${showtimeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Showtime deleted");
  });

});