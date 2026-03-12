import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { getUserById } from "../repositories/auth.repository";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body);

    res.json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};


export const fetchUser = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

 

  if (!userId) return res.status(400).json({ message: "Utilisateur non connecté" });

  try {
    const user = await getUserById(userId);
  
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};