import { Request, Response } from "express";
import * as importService from "../services/import.service";
import { io } from "../server"; //  

export const importFileData = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    // Notification début
    io.emit("import_status", { message: "Importation en cours..." });

    const count = await importService.processImportFile(req.file.originalname, req.file.mimetype);

    // Supprimer le fichier temporaire
    const fs = require("fs");
    fs.unlinkSync(req.file.path);

    // Notification fin
    io.emit("import_status", { message: `Importation réussie : ${count} éléments ajoutés.` });

    res.status(200).json({ message: `Importation réussie : ${count} éléments ajoutés.` });
  } catch (error) {
    io.emit("import_status", { message: "Erreur lors de l'importation" });
    res.status(500).json({ message: "Erreur lors de l'importation", error });
  }
};