import pool from "../config/db";
import { CreateUserInput, User } from "../models/user.model";

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const query = `
    INSERT INTO users (email, password, role)
    VALUES ($1,$2,$3)
    RETURNING *
  `;

  const values = [data.email, data.password, data.role || "user"];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
};



export const getUserById = async (id: number): Promise<User | null> => {
  const res = await pool.query("SELECT id, email, role, created_at FROM users WHERE id = $1", [id]);
  if (res.rows.length === 0) return null;
  return res.rows[0];
};