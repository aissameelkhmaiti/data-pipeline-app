import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, {
    expiresIn: "1d",
  });
};