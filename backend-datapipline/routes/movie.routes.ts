import { Router } from "express";
import {
    createMovieController,
    getAllMoviesController,
    getMovieByIdController,
    updateMovieController,

} from "../controllers/movie.controller";

import { authMiddleware } from "../middlewares/auth.middleware";



import multer from "multer";
import { importFileData } from "../controllers/import.controller";


const upload = multer({ dest: "uploads/" }); // Stockage temporaire
const router = Router();

router.post("/import", upload.single("file"), importFileData);

// CRUD Movies
router.post("/", authMiddleware, createMovieController); // protéger si nécessaire
router.get("/", getAllMoviesController);
router.get("/:id", getMovieByIdController);
router.put("/:id", authMiddleware, updateMovieController);
// router.delete("/:id", authMiddleware, deleteMovieController);

export default router;
