import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../app";
import pool from "../config/db";

let token: string;
let movieId: number;

describe("Movies API", () => {

  // Avant tout, créer un utilisateur et récupérer le token pour les routes protégées
  beforeAll(async () => {
    const email = `testmovie${Date.now()}@mail.com`;
    const password = "123456";

    // Inscription
    const resRegister = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    token = resRegister.body.token;
  });

  it("should create a new movie", async () => {
    const movieData = {
      title: "Avatar 2",
      release_date: "2009-12-18",
      duration: 162,
      genre: "Science Fiction"
    };

    const res = await request(app)
      .post("/api/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(movieData);

    expect(res.status).toBe(201);
    expect(res.body.movie).toHaveProperty("id");
    expect(res.body.movie.title).toBe(movieData.title);

    movieId = res.body.movie.id;
  });

  it("should get all movies", async () => {
    const res = await request(app)
      .get("/api/movies");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.movies)).toBe(true);
    expect(res.body.movies.length).toBeGreaterThan(0);
  });

  it("should get movie by id", async () => {
    const res = await request(app)
      .get(`/api/movies/${movieId}`);

    expect(res.status).toBe(200);
    expect(res.body.movie).toHaveProperty("id");
    expect(res.body.movie.id).toBe(movieId);
  });

  it("should update a movie", async () => {
    const updatedData = {
      title: "Avatar Updated 2",
      duration: 165
    };

    const res = await request(app)
      .put(`/api/movies/${movieId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.movie.title).toBe(updatedData.title);
    expect(res.body.movie.duration).toBe(updatedData.duration);
  });

  // it("should delete a movie", async () => {
  //   const res = await request(app)
  //     .delete(`/api/movies/${movieId}`)
  //     .set("Authorization", `Bearer ${token}`);

  //   expect(res.status).toBe(200);
  //   expect(res.body.message).toBe("Movie deleted");
  // });

  // Après tous les tests, fermer la connexion à la DB
  afterAll(async () => {
    await pool.end();
  });

});