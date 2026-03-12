import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../app";
import pool from "../config/db";

let token: string; // token pour routes protégées
let cinemaId: number;

describe("Cinema API CRUD", () => {
  // Avant tout : créer un user admin pour obtenir le token
  beforeAll(async () => {
    const email = `admin${Date.now()}@mail.com`;
    const password = "123456";

    // Inscription
    const resRegister = await request(app)
      .post("/api/auth/register")
      .send({ email, password, role: "admin" });

    token = resRegister.body.token;
  });

  // Après tous les tests : fermer la connexion DB
  afterAll(async () => {
    await pool.end();
  });

  it("should create a new cinema", async () => {
    const res = await request(app)
      .post("/api/cinemas")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Cinema Test", city: "Casablanca", country: "Morocco" });

    expect(res.status).toBe(201);
    expect(res.body.cinema).toHaveProperty("id");
    expect(res.body.cinema.name).toBe("Cinema Test");

    cinemaId = res.body.cinema.id; // sauvegarder l'id pour les tests suivants
  });

   

  it("should fetch cinema by id", async () => {
    const res = await request(app).get(`/api/cinemas/${cinemaId}`);

    expect(res.status).toBe(200);
    expect(res.body.cinema).toHaveProperty("id", cinemaId);
    expect(res.body.cinema.name).toBe("Cinema Test");
  });

  it("should update cinema", async () => {
    const res = await request(app)
      .put(`/api/cinemas/${cinemaId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Cinema Updated" });

    expect(res.status).toBe(200);
    expect(res.body.cinema.name).toBe("Cinema Updated");
  });

  it("should delete cinema", async () => {
    const res = await request(app)
      .delete(`/api/cinemas/${cinemaId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Cinema deleted");

    // Vérifier que le cinéma n’existe plus
    const check = await request(app).get(`/api/cinemas/${cinemaId}`);
    expect(check.status).toBe(404);
  });
});