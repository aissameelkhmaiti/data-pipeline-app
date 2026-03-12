import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];
  

  try {
    const decoded = jwt.verify(token, SECRET) as { userId :Number};
   
    (req as any).userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};