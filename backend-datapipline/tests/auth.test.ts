import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app";
import pool from "../config/db";

let token: string;

describe("Auth API", () => {

  // Avant de tester, créer un utilisateur et récupérer le token
  beforeAll(async () => {
    const email = `test${Date.now()}@mail.com`;
    const password = "123456";

    // Inscription
    const resRegister = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    token = resRegister.body.token;
  });

  it("should fetch the connected user info", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user).toHaveProperty("role");
    expect(res.body.user.email).toContain("@mail.com");
  });

});