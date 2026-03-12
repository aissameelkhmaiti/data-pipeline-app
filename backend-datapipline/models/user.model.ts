export type UserRole = "admin" | "user";

export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginUserInput {
  email: string;
  password: string;
}