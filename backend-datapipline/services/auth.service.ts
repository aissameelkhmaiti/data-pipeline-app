import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../repositories/auth.repository";
import { CreateUserInput, LoginUserInput } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const registerUser = async (data: CreateUserInput) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUser({
    email: data.email,
    password: hashedPassword,
  });

  const token = generateToken(user.id);

  return { user, token };
};

export const loginUser = async (data: LoginUserInput) => {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error("le utilisateur n'est pas exist");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("email ou mots de passe incorrect");
  }

  const token = generateToken(user.id);

  return { user, token };
};