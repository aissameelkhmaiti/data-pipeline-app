import { Request, Response } from "express";
import * as importService from "../services/import.service";

export const importFileData = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    console.log(req.file)

    const count = await importService.processImportFile(req.file.path, req.file.mimetype);
 
    
    // Supprimer le fichier temporaire après traitement
    const fs = require('fs');
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: `Importation réussie : ${count} éléments ajoutés.` });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'importation", error });
  }
};